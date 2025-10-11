import React from "react";
import MeetForm from "../../components/Meets/MeetForm";
import MeetList from "../../components/Meets/MeetList";

export default function CreatePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        🎥 Crear nueva reunión
      </h1>
      <MeetForm />
      <hr className="my-6" />
      <MeetList />
    </div>
  );
}
