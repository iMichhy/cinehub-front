import { useEffect, useState } from "react";
import screeningServices from "../Services/screeningServices";
import { useNavigate } from "react-router";
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


function ScreeningsPage() {

  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const navigate = useNavigate();
  const fetchScreenings = async () => {
    try {
      const response = await screeningServices.getAll();
      const calendarEvents = response.data.map((screening) => ({
        id: screening.sc_id,            
        title: screening.fi_title,      
        start: screening.sc_datetime,   
        extendedProps: {
          salle: screening.ro_name,
          prix: screening.sc_price
        },
      }));
      setEvents(calendarEvents);
    } catch (error) {
      console.error(error);
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
    fetchScreenings();
  }, []);

  return (
    <main className="container">
      <style>{`
        .calendar-day { cursor: pointer; transition: background-color 0.15s; }
        .calendar-day:hover { background-color: var(--bs-primary-bg-subtle, rgba(13, 110, 253, 0.12)) !important; }
      `}</style>

      <h1 className="h2 mb-3">Séances</h1>

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
                              {toDate(event.start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} · {event.extendedProps.salle} · {event.extendedProps.prix} €
                            </div>
                          </div>
                          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/screenings/${event.id}`)}>
                            Détail
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-secondary mb-0">Aucune séance ce jour-là.</p>
                  )}
                </>
              ) : (
                <p className="text-secondary mb-0">Cliquez sur un jour du calendrier pour voir ses séances.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ScreeningsPage;