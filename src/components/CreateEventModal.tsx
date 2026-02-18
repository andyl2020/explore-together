import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { MapEvent } from "@/types";
import { currentUser } from "@/data/mockData";

interface CreateEventModalProps {
  onCreateEvent: (event: MapEvent) => void;
}

const CreateEventModal = ({ onCreateEvent }: CreateEventModalProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "food" as MapEvent["category"],
    address: "",
    date: "",
    time: "",
    price: "",
    maxAttendees: "6",
  });

  const handleSubmit = () => {
    const newEvent: MapEvent = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      category: form.category,
      location: {
        lat: 40.73 + (Math.random() - 0.5) * 0.05,
        lng: -73.99 + (Math.random() - 0.5) * 0.05,
        address: form.address,
      },
      date: form.date,
      time: form.time,
      price: form.price.startsWith("$") ? form.price : `$${form.price}`,
      createdBy: currentUser,
      attendees: [],
      maxAttendees: parseInt(form.maxAttendees) || 6,
      accepted: false,
    };
    onCreateEvent(newEvent);
    setOpen(false);
    setForm({ title: "", description: "", category: "food", address: "", date: "", time: "", price: "", maxAttendees: "6" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground shadow-elevated gap-2">
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Create an Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-sm font-medium text-foreground">Title</Label>
            <Input
              placeholder="e.g. Taco Tuesday at La Esquina"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Description</Label>
            <Textarea
              placeholder="What's the plan?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium text-foreground">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as MapEvent["category"] })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">🍜 Food</SelectItem>
                  <SelectItem value="activity">⚡ Activity</SelectItem>
                  <SelectItem value="nightlife">🌙 Nightlife</SelectItem>
                  <SelectItem value="outdoors">🌿 Outdoors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Max Attendees</Label>
              <Input
                type="number"
                value={form.maxAttendees}
                onChange={(e) => setForm({ ...form, maxAttendees: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Location</Label>
            <Input
              placeholder="Address or venue name"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-sm font-medium text-foreground">Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Time</Label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Price</Label>
              <Input
                placeholder="$25"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!form.title || !form.address}
            className="w-full gradient-primary text-primary-foreground"
          >
            Post Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
