import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, Moon, Camera, Trash2, Pencil, Eye, EyeOff, Mail, Lock, User, Gamepad2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("Usuario");
  const [email, setEmail] = useState("usuario@email.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [editingField, setEditingField] = useState<"name" | "email" | "password" | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast({ title: "Foto actualizada", description: "Tu foto de perfil se ha cambiado correctamente." });
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    toast({ title: "Foto eliminada", description: "Tu foto de perfil se ha eliminado." });
  };

  const handleSaveName = () => {
    setEditingField(null);
    toast({ title: "Nombre actualizado", description: "Tu nombre se ha guardado correctamente." });
  };

  const handleSaveEmail = () => {
    setEditingField(null);
    toast({ title: "Email actualizado", description: "Tu email se ha guardado correctamente." });
  };

  const handleSavePassword = () => {
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "La contraseña debe tener al menos 6 caracteres.", variant: "destructive" });
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setEditingField(null);
    toast({ title: "Contraseña actualizada", description: "Tu contraseña se ha cambiado correctamente." });
  };

  const handleForgotPassword = () => {
    toast({ title: "Email enviado", description: "Revisa tu bandeja de entrada para restablecer tu contraseña." });
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 md:px-6">
          <button onClick={() => navigate("/home")} className="rounded-full p-2 hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <span className="text-base font-bold text-foreground md:text-lg">Mi Perfil</span>
          <button onClick={toggleTheme} className="rounded-full p-2 hover:bg-muted transition-colors" aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-5 w-5 text-foreground" /> : <Sun className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-12 pt-8 md:px-6">
        {/* Avatar Section */}
        <div className="mb-10 flex flex-col items-center">
          <div className="relative group">
            <Avatar className="h-28 w-28 border-4 border-primary/20 shadow-lg">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt="Foto de perfil" className="object-cover" />
              ) : (
                <AvatarFallback className="bg-primary/10 text-3xl font-bold text-primary">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            {/* Overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/0 group-hover:bg-foreground/40 transition-colors">
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-background/90 p-2 shadow-md hover:bg-background transition-colors"
                  aria-label={avatarUrl ? "Cambiar foto" : "Añadir foto"}
                >
                  {avatarUrl ? <Pencil className="h-4 w-4 text-foreground" /> : <Camera className="h-4 w-4 text-foreground" />}
                </button>
                {avatarUrl && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="rounded-full bg-background/90 p-2 shadow-md hover:bg-destructive/10 transition-colors"
                        aria-label="Eliminar foto"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar foto de perfil?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveAvatar} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>

          {/* Upload button for mobile */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-sm font-medium text-primary hover:underline md:hidden"
          >
            {avatarUrl ? "Cambiar foto" : "Añadir foto"}
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div className="rounded-2xl border border-border bg-card p-4 md:p-5 transition-all">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre</label>
              {editingField !== "name" && (
                <button onClick={() => setEditingField("name")} className="text-xs font-medium text-primary hover:underline">
                  Editar
                </button>
              )}
            </div>
            {editingField === "name" ? (
              <div className="space-y-3 mt-2">
                <div className="relative">
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-10" placeholder="Tu nombre" />
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setEditingField(null)}>Cancelar</Button>
                  <Button size="sm" onClick={handleSaveName}>Guardar</Button>
                </div>
              </div>
            ) : (
              <p className="text-base font-medium text-foreground">{name}</p>
            )}
          </div>

          {/* Email */}
          <div className="rounded-2xl border border-border bg-card p-4 md:p-5 transition-all">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
              {editingField !== "email" && (
                <button onClick={() => setEditingField("email")} className="text-xs font-medium text-primary hover:underline">
                  Editar
                </button>
              )}
            </div>
            {editingField === "email" ? (
              <div className="space-y-3 mt-2">
                <div className="relative">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="tu@email.com" />
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setEditingField(null)}>Cancelar</Button>
                  <Button size="sm" onClick={handleSaveEmail}>Guardar</Button>
                </div>
              </div>
            ) : (
              <p className="text-base font-medium text-foreground">{email}</p>
            )}
          </div>

          {/* Password */}
          <div className="rounded-2xl border border-border bg-card p-4 md:p-5 transition-all">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contraseña</label>
              {editingField !== "password" && (
                <button onClick={() => setEditingField("password")} className="text-xs font-medium text-primary hover:underline">
                  Cambiar
                </button>
              )}
            </div>
            {editingField === "password" ? (
              <div className="space-y-3 mt-2">
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Contraseña actual"
                  />
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Nueva contraseña"
                    minLength={6}
                  />
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <button type="button" onClick={handleForgotPassword} className="text-xs font-medium text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingField(null); setCurrentPassword(""); setNewPassword(""); }}>Cancelar</Button>
                    <Button size="sm" onClick={handleSavePassword}>Guardar</Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-base font-medium text-foreground">••••••••</p>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => navigate("/")}
          >
            Cerrar sesión
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
