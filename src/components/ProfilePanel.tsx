import { useState } from "react";
import { UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Edit2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfilePanelProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  onClose: () => void;
}

const AGE_RANGES = ["18-21", "22-25", "25-30", "28-32", "30-35", "35-40", "40+"];
const HOBBY_OPTIONS = ["hiking", "photography", "cooking", "painting", "yoga", "travel", "cycling", "music", "wine tasting", "surfing", "reading", "gaming", "dancing", "running", "gardening"];

const ProfilePanel = ({ user, onUpdate, onClose }: ProfilePanelProps) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);
  const [newHobby, setNewHobby] = useState("");

  const handleSave = () => {
    onUpdate(form);
    setEditing(false);
  };

  const addHobby = (hobby: string) => {
    if (hobby && !form.hobbies.includes(hobby)) {
      setForm({ ...form, hobbies: [...form.hobbies, hobby] });
    }
    setNewHobby("");
  };

  const removeHobby = (hobby: string) => {
    setForm({ ...form, hobbies: form.hobbies.filter((h) => h !== hobby) });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="w-80 h-full bg-card border-l border-border flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display font-bold text-lg">Profile</h2>
          <div className="flex gap-2">
            {editing ? (
              <Button size="sm" onClick={handleSave} variant="ghost" className="text-accent">
                <Save className="w-4 h-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={() => setEditing(true)} variant="ghost">
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center text-2xl font-bold text-primary-foreground font-display">
              {form.name.split(" ").map(n => n[0]).join("")}
            </div>
            {editing ? (
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-3 text-center"
              />
            ) : (
              <h3 className="font-display font-bold text-lg mt-3">{form.name}</h3>
            )}
            <p className="text-sm text-muted-foreground">@{form.username}</p>
          </div>

          {/* Bio */}
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Bio</Label>
            {editing ? (
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="mt-1"
                rows={2}
              />
            ) : (
              <p className="text-sm mt-1">{form.bio}</p>
            )}
          </div>

          {/* Age Range */}
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Age Range</Label>
            {editing ? (
              <Select value={form.ageRange} onValueChange={(v) => setForm({ ...form, ageRange: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AGE_RANGES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm mt-1 font-medium">{form.ageRange}</p>
            )}
          </div>

          {/* Occupation */}
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Occupation</Label>
            {editing ? (
              <Input
                value={form.occupation}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="text-sm mt-1 font-medium">{form.occupation}</p>
            )}
          </div>

          {/* Hobbies */}
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Hobbies & Interests</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.hobbies.map((hobby) => (
                <Badge
                  key={hobby}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => editing && removeHobby(hobby)}
                >
                  {hobby}
                  {editing && <X className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
            </div>
            {editing && (
              <div className="mt-2">
                <Select value={newHobby} onValueChange={(v) => addHobby(v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Add a hobby..." />
                  </SelectTrigger>
                  <SelectContent>
                    {HOBBY_OPTIONS.filter(h => !form.hobbies.includes(h)).map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfilePanel;
