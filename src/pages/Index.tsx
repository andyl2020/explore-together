import { useState, useCallback } from "react";
import MapView from "@/components/MapView";
import EventList from "@/components/EventList";
import CreateEventModal from "@/components/CreateEventModal";
import ProfilePanel from "@/components/ProfilePanel";
import AuthPage from "@/components/AuthPage";
import { mockEvents, currentUser } from "@/data/mockData";
import { MapEvent, UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { MapPin, List, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [events, setEvents] = useState<MapEvent[]>(mockEvents);
  const [user, setUser] = useState<UserProfile>(currentUser);
  const [showList, setShowList] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);

  const handleJoin = useCallback((id: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, accepted: true, attendees: [...e.attendees, user] }
          : e
      )
    );
  }, [user]);

  const handleCreateEvent = useCallback((event: MapEvent) => {
    setEvents((prev) => [event, ...prev]);
  }, []);

  const handleEventClick = useCallback((event: MapEvent) => {
    setSelectedEvent(event);
  }, []);

  if (!loggedIn) {
    return <AuthPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-xl text-foreground">SpotUp</h1>
        </div>

        <div className="flex items-center gap-2">
          <CreateEventModal onCreateEvent={handleCreateEvent} />
          <Button
            variant={showList ? "default" : "ghost"}
            size="sm"
            onClick={() => { setShowList(!showList); setShowProfile(false); }}
            className={showList ? "gradient-primary text-primary-foreground" : ""}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={showProfile ? "default" : "ghost"}
            size="sm"
            onClick={() => { setShowProfile(!showProfile); setShowList(false); }}
            className={showProfile ? "gradient-primary text-primary-foreground" : ""}
          >
            <User className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setLoggedIn(false)}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map */}
        <div className="flex-1 relative">
          <MapView events={events} onEventClick={handleEventClick} />

          {/* Selected event overlay */}
          <AnimatePresence>
            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 max-w-md z-10"
              >
                <div className={`bg-card rounded-xl p-4 shadow-elevated border ${selectedEvent.accepted ? 'border-accent event-accepted' : 'border-border'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display font-bold text-lg">{selectedEvent.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{selectedEvent.description}</p>
                      <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
                        <span>🕐 {selectedEvent.time}</span>
                        <span>💰 {selectedEvent.price}</span>
                        <span>👥 {selectedEvent.maxAttendees - selectedEvent.attendees.length} spots</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>✕</Button>
                  </div>
                  {!selectedEvent.accepted && (
                    <Button
                      className="w-full mt-3 gradient-primary text-primary-foreground"
                      onClick={() => {
                        handleJoin(selectedEvent.id);
                        setSelectedEvent({ ...selectedEvent, accepted: true });
                      }}
                    >
                      Join Event
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Side Panel */}
        <AnimatePresence>
          {showList && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-border bg-card overflow-hidden shrink-0"
            >
              <div className="w-[360px] h-full">
                <EventList events={events} onJoin={handleJoin} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showProfile && (
            <ProfilePanel
              user={user}
              onUpdate={setUser}
              onClose={() => setShowProfile(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
