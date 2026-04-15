export const assetTypes = ["Classroom", "Laboratory", "Auditorium", "Sports Complex"];

export const initialAssetForm = {
  title: "",
  type: "Classroom",
  location: "",
  pricePerHour: "",
  capacity: "",
  description: "",
  image: "",
  amenities: "Projector, WiFi",
  availability: [
    { day: "Monday", slots: ["09:00-12:00"] },
  ],
};

export const roleOptions = [
  { label: "User", value: "user" },
  { label: "Organizer", value: "organizer" },
  { label: "Admin", value: "admin" },
];
