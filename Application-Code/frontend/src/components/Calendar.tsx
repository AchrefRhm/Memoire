// components/Calendar.tsx
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import toast from "react-hot-toast";
import { format } from "date-fns";
import { Dialog, Transition } from "@headlessui";
import { Fragment } from "react";

interface CalendarProps {
  onEventClick?: (event) => void;
  onDateSelect?: (start: Date, end: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  onEventClick,
  onDateSelect,
}) => {
  const [events, setEvents] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = async (start: string, end: string) => {
    try {
      setIsLoading(true);

      setEvents("data");
    } catch (error) {
      toast.error("Failed to load calendar events");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (info: any) => {
    const event = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end?.toISOString(),
      allDay: info.event.allDay,
      extendedProps: info.event.extendedProps,
    };

    setSelectedEvent(event);
    setIsModalOpen(true);

    if (onEventClick) {
      onEventClick(event);
    }
  };

  const handleDateSelect = (info: any) => {
    if (onDateSelect) {
      onDateSelect(info.start, info.end);
    }
  };

  const handleDatesSet = (info: any) => {
    const start = info.start.toISOString();
    const end = info.end.toISOString();
    fetchEvents(start, end);
  };

  const getEventColor = (event: any) => {
    const type = event.extendedProps?.type;
    const status = event.extendedProps?.status;
    const priority = event.extendedProps?.priority;

    if (type === "interview") return "#3b82f6"; // blue
    if (type === "follow-up") return "#10b981"; // green
    if (type === "task") {
      if (priority === "high") return "#ef4444"; // red
      if (priority === "medium") return "#f59e0b"; // amber
      return "#8b5cf6"; // purple
    }

    if (status === "applied") return "#8b5cf6"; // purple
    if (status === "interview") return "#3b82f6"; // blue
    if (status === "offer") return "#10b981"; // green
    if (status === "rejected") return "#ef4444"; // red

    return "#6b7280"; // gray
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="h-full">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={handleEventClick}
        select={handleDateSelect}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        datesSet={handleDatesSet}
        eventContent={(eventInfo) => {
          const type = eventInfo.event.extendedProps?.type;
          const priority = eventInfo.event.extendedProps?.priority;
          let icon = "";

          if (type === "interview") icon = "👥";
          if (type === "follow-up") icon = "📞";
          if (type === "task") icon = "✅";
          if (type === "application") icon = "📝";

          let priorityBadge = "";
          if (priority === "high") priorityBadge = "🔴";
          if (priority === "medium") priorityBadge = "🟠";
          if (priority === "low") priorityBadge = "🟢";

          return (
            <div className="flex items-center">
              <div className="mr-1">{icon}</div>
              <div className="flex-grow truncate">{eventInfo.event.title}</div>
              {priorityBadge && <div className="ml-1">{priorityBadge}</div>}
            </div>
          );
        }}
        eventBackgroundColor={(info) => getEventColor(info.event)}
        eventBorderColor={(info) => getEventColor(info.event)}
        height="100%"
      />

      <Transition show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {selectedEvent && (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {selectedEvent.title}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Type:</span>{" "}
                          {selectedEvent.extendedProps?.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Date:</span>{" "}
                          {format(new Date(selectedEvent.start), "PPP")}
                        </p>
                        {selectedEvent.end && (
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">End:</span>{" "}
                            {format(new Date(selectedEvent.end), "PPP")}
                          </p>
                        )}
                        {selectedEvent.extendedProps?.description && (
                          <p className="mt-2 text-sm text-gray-500">
                            {selectedEvent.extendedProps.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          className="bg-primary-100 text-primary-900 hover:bg-primary-200 focus-visible:ring-primary-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
