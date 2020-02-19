
// Import image
import live_camera_icon from "../icons/live_camera.png";
import camera_trap_icon from "../icons/camera_trap.png";
import noise_sensor_icon from "../icons/microphone.png";
import unique_public_source_icon from "../icons/unique_public_source.png";

const Sensor_data = [
    {"type": "camera_trap", "latitude":51.5094, "longitude":-2.5890, "icon": camera_trap_icon, "id": 0,
     "last_event_received": "4 hours ago", "frequency": "one-off", "health": "healthy", "status": "on",
     "created": "none", "access": "private", "provenance": "first_hand", "name": "camera_trap_1"},
    {"type": "unique_public_source","latitude":51.5100,"longitude":-2.5957, "icon": unique_public_source_icon, "id": 1,
     "last_event_received": "4 hours ago", "frequency": "one-off", "health": "healthy", "status": "on",
     "created": "none", "access": "private", "provenance": "first_hand", "name": "bristol_pollution"},
    {"type": "noise_sensor", "latitude":51.5085, "longitude":-2.5950, "icon": noise_sensor_icon, "id": 2,
     "last_event_received": "4 hours ago", "frequency": "one-off", "health": "healthy", "status": "on",
     "created": "none", "access": "private", "provenance": "first_hand", "name": "microphone_1"},
    {"type": "live_camera","latitude":51.5080,"longitude":-2.5925, "icon": live_camera_icon, "id": 3,
     "last_event_received": "4 hours ago", "frequency": "one-off", "health": "healthy", "status": "on",
     "created": "none", "access": "private", "provenance": "first_hand", "name": "field_camera_1"}
];

export default Sensor_data;