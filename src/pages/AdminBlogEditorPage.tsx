import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CATEGORIES = ["Gramática", "Vocabulario", "Cultura", "Consejos", "Pronunciación"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function estimateReadingTime(text: string) {
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

export default function AdminBlogEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [published, setPublished] = useState(false);
  const [authorName, setAuthorName] = useState("Equipo VerboFlow");
  const [saving, setSaving] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("blog_admin")) {
      navigate("/admin/blog");
    }
  }, [navigate]);

  useEffect(() => {
    if (isEdit) {
      supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setTitle(data.title);
            setSlug(data.slug);
            setExcerpt(data.excerpt || "");
            setContent(data.content);
            setCoverUrl(data.cover_image_url || "");
            setCategory(data.category || "");
            setTagsInput((data.tags || []).join(", "));
            setPublished(data.published || false);
            setAuthorName(data.author_name || "Equipo VerboFlow");
            setSlugManual(true);
          }
        });
    }
  }, [id, isEdit]);

  useEffect(() => {
    if (!slugManual && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  const readingTime = useMemo(() => estimateReadingTime(content), [content]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !slug.trim()) {
      toast({ title: "Título, slug y contenido son obligatorios", variant: "destructive" });
      return;
    }

    setSaving(true);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const postData = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      cover_image_url: coverUrl || null,
      category: category || null,
      tags: tags.length > 0 ? tags : null,
      published,
      author_name: authorName,
      reading_time: readingTime,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("blog_posts").update(postData).eq("id", id));
    } else {
      ({ error } = await supabase.from("blog_posts").insert(postData));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isEdit ? "Artículo actualizado" : "Artículo creado" });
      navigate("/admin/blog");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/blog")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">
              {isEdit ? "Editar artículo" : "Nuevo artículo"}
            </h1>
          </div>
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-1">
            <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Editor */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del artículo"
                className="mt-1 text-lg font-semibold"
              />
            </div>

            <div>
              <Label htmlFor="slug">
                Slug{" "}
                <button
                  type="button"
                  className="ml-2 text-xs text-primary hover:underline"
                  onClick={() => {
                    setSlugManual(false);
                    setSlug(slugify(title));
                  }}
                >
                  Auto-generar
                </button>
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManual(true);
                }}
                placeholder="url-del-articulo"
                className="mt-1 font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Extracto (SEO)</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Breve descripción para la tarjeta y meta description..."
                rows={2}
                className="mt-1"
              />
            </div>

            {/* Content with preview */}
            <Tabs defaultValue="write" className="w-full">
              <TabsList>
                <TabsTrigger value="write">Escribir</TabsTrigger>
                <TabsTrigger value="preview" className="gap-1">
                  <Eye className="h-3.5 w-3.5" /> Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="write">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe en Markdown..."
                  rows={20}
                  className="font-mono text-sm"
                />
              </TabsContent>
              <TabsContent value="preview">
                <div className="min-h-[320px] rounded-md border border-input bg-background p-4 prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
                  {content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground italic">Sin contenido todavía...</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-5 rounded-2xl border border-border/50 bg-card p-5">
            <div className="flex items-center justify-between">
              <Label>Publicado</Label>
              <Switch checked={published} onCheckedChange={setPublished} />
            </div>

            <div>
              <Label>Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags (separados por coma)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="A1, verbos, Konjunktiv..."
                className="mt-1"
              />
              {tagsInput && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {tagsInput
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="cover">URL imagen de portada</Label>
              <Input
                id="cover"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt="Preview"
                  className="mt-2 w-full rounded-lg object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                />
              )}
            </div>

            <div>
              <Label htmlFor="author">Autor</Label>
              <Input
                id="author"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                ⏱ Tiempo de lectura estimado: <strong>{readingTime} min</strong>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
