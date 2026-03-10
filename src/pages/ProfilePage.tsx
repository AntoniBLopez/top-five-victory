import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, Moon, Camera, Trash2, Pencil, Eye, EyeOff, Mail, Lock, User, LogOut, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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
  const [editDialog, setEditDialog] = useState<"name" | "email" | "password" | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast({ title: "Foto actualizada ✨" });
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    toast({ title: "Foto eliminada" });
  };

  const handleSaveName = () => {
    setEditDialog(null);
    toast({ title: "Nombre actualizado ✅" });
  };

  const handleSaveEmail = () => {
    setEditDialog(null);
    toast({ title: "Email actualizado ✅" });
  };

  const handleSavePassword = () => {
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Mínimo 6 caracteres.", variant: "destructive" });
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setEditDialog(null);
    toast({ title: "Contraseña actualizada ✅" });
  };

  const handleForgotPassword = () => {
    toast({ title: "Email enviado 📧", description: "Revisa tu bandeja de entrada." });
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <button onClick={() => navigate("/home")} className="rounded-full p-2 hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <span className="text-base font-bold text-foreground">Perfil</span>
          <button onClick={toggleTheme} className="rounded-full p-2 hover:bg-muted transition-colors">
            {theme === "light" ? <Moon className="h-5 w-5 text-foreground" /> : <Sun className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-16 pt-8">
        {/* Avatar + Name hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="relative group mb-4">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20 shadow-xl">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt="Foto de perfil" className="object-cover" />
              ) : (
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-200">
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-background/90 p-1.5 shadow hover:bg-background"
                >
                  {avatarUrl ? <Pencil className="h-3.5 w-3.5 text-foreground" /> : <Camera className="h-3.5 w-3.5 text-foreground" />}
                </button>
                {avatarUrl && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="rounded-full bg-background/90 p-1.5 shadow hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar foto?</AlertDialogTitle>
                        <AlertDialogDescription>No se puede deshacer.</AlertDialogDescription>
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

          <h1 className="text-xl font-bold text-foreground">{name}</h1>
          <p className="text-sm text-muted-foreground">{email}</p>

          {/* Mobile upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 text-xs font-medium text-primary hover:underline md:hidden"
          >
            {avatarUrl ? "Cambiar foto" : "Añadir foto"}
          </button>
        </motion.div>

        {/* Settings list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card overflow-hidden"
        >
          {/* Name row */}
          <button
            onClick={() => setEditDialog("name")}
            className="flex items-center w-full px-4 py-3.5 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 mr-3">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs text-muted-foreground">Nombre</p>
              <p className="text-sm font-medium text-foreground">{name}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="h-px bg-border mx-4" />

          {/* Email row */}
          <button
            onClick={() => setEditDialog("email")}
            className="flex items-center w-full px-4 py-3.5 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 mr-3">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">{email}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="h-px bg-border mx-4" />

          {/* Password row */}
          <button
            onClick={() => setEditDialog("password")}
            className="flex items-center w-full px-4 py-3.5 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 mr-3">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs text-muted-foreground">Contraseña</p>
              <p className="text-sm font-medium text-foreground">••••••••</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center w-full px-4 py-3.5 rounded-2xl border border-destructive/20 hover:bg-destructive/5 transition-colors"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-destructive/10 mr-3">
              <LogOut className="h-4 w-4 text-destructive" />
            </div>
            <span className="text-sm font-medium text-destructive">Cerrar sesión</span>
          </button>
        </motion.div>
      </main>

      {/* Edit Name Dialog */}
      <Dialog open={editDialog === "name"} onOpenChange={(open) => !open && setEditDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar nombre</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" autoFocus />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setEditDialog(null)}>Cancelar</Button>
              <Button size="sm" onClick={handleSaveName}>Guardar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Email Dialog */}
      <Dialog open={editDialog === "email"} onOpenChange={(open) => !open && setEditDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" autoFocus />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setEditDialog(null)}>Cancelar</Button>
              <Button size="sm" onClick={handleSaveEmail}>Guardar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Password Dialog */}
      <Dialog open={editDialog === "password"} onOpenChange={(open) => { if (!open) { setEditDialog(null); setCurrentPassword(""); setNewPassword(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Contraseña actual"
                className="pr-10"
              />
              <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                className="pr-10"
              />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <button type="button" onClick={handleForgotPassword} className="text-xs font-medium text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => { setEditDialog(null); setCurrentPassword(""); setNewPassword(""); }}>Cancelar</Button>
              <Button size="sm" onClick={handleSavePassword}>Guardar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
