import React from "react";
import MeetList from "../../components/Meets/MeetList";

export default function ManagePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        🗂️ Administrar reuniones
      </h1>
      <MeetList showActions={true} />
    </div>
  );
}
