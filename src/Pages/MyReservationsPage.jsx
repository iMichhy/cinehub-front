import { useEffect, useState } from "react";
import reservationServices from "../Services/reservationServices";
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/blue.css";
import FullCalendar from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import frLocale from "@fullcalendar/react/locales/fr";


const toDate = (d) => new Date(String(d).replace(" ", "T"));
const dayKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;


function MyReservationsPage() {

  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [message, setMessage] = useState(null);
  const fetchReservations = async () => {
    try {
      const response = await reservationServices.getMe();
      const calendarEvents = response.data.map((reservation) => ({
        id: reservation.re_id,            
        title: reservation.fi_title,      
        start: reservation.sc_datetime,   
        extendedProps: {
          salle: reservation.ro_name,
          prix: reservation.sc_price,
          places: reservation.re_seats
        },
      }));
      setEvents(calendarEvents);
    } catch (error) {
      setMessage({ type: "danger", text: error?.response?.data?.error || "Impossible de charger vos réservations." });
    }
  };

  const cancelReservation = async (id) => {
    if (!window.confirm("Annuler cette réservation ?")) return;
    setMessage(null);
    try {
      await reservationServices.deleteReservation(id);
      setMessage({ type: "success", text: "Réservation annulée." });
      fetchReservations();
    } catch (error) {
      setMessage({ type: "danger", text: error?.response?.data?.error || "L'annulation a échoué." });
    }
  };

  const handleDateClick = (info) => {
    setSelectedDay(info.dateStr);
  };

  const handleEventClick = (info) => {
    setSelectedDay(dayKey(info.event.start));
  };

  const daySelection = events.filter((event) => dayKey(toDate(event.start)) === selectedDay);

  useEffect(() => {
    fetchReservations();
  }, []);

  // RENDU
  return (
    <main className="container">
      <style>{`
        .calendar-day { cursor: pointer; transition: background-color 0.15s; }
        .calendar-day:hover { background-color: var(--bs-primary-bg-subtle, rgba(13, 110, 253, 0.12)) !important; }
      `}</style>

      <h1 className="h2 mb-3">Mes réservations</h1>
      {message && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <section className="card border-0 shadow-sm">
            <div className="card-body p-3" style={{ fontSize: "0.85rem" }}>
              <FullCalendar
                plugins={[themePlugin, dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={frLocale}
                events={events}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                dayCellClassNames={(arg) =>
                  dayKey(arg.date) === selectedDay
                    ? ["calendar-day", "bg-primary", "bg-opacity-25"]
                    : ["calendar-day"]
                }
                dayMaxEvents={2}
                fixedWeekCount={false}
                eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                height="auto"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "",
                }}
                buttonText={{ today: "Aujourd'hui" }}
              />
            </div>
          </section>
        </div>

        <div className="col-12 col-lg-4">
          <section className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              {selectedDay ? (
                <>
                  <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                    <h2 className="h5 fw-bold text-capitalize mb-0">
                      {new Date(`${selectedDay}T00:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </h2>
                    <span className="badge rounded-pill bg-primary">{daySelection.length}</span>
                  </div>

                  {daySelection.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {daySelection.map((event) => (
                        <li key={event.id} className="list-group-item px-0 d-flex justify-content-between align-items-center gap-3">
                          <div>
                            <span className="fw-semibold">{event.title}</span>
                            <div className="text-secondary small">
                              {toDate(event.start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} · {event.extendedProps.salle}
                            </div>
                            <div className="text-secondary small">
                              {event.extendedProps.places} place{event.extendedProps.places === 1 ? "" : "s"} · {event.extendedProps.prix} € / place
                            </div>
                          </div>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => cancelReservation(event.id)}>
                            Annuler
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-secondary mb-0">Aucune réservation ce jour-là.</p>
                  )}
                </>
              ) : (
                <p className="text-secondary mb-0">
                  {events.length === 0
                    ? "Vous n'avez aucune réservation."
                    : "Cliquez sur un jour du calendrier pour voir vos réservations."}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default MyReservationsPage;