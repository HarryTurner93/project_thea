
// Import image
import live_camera_icon from "../icons/live_camera.png";
import camera_trap_icon from "../icons/camera_trap.png";
import noise_sensor_icon from "../icons/microphone.png";
import unique_public_source_icon from "../icons/unique_public_source.png";

import badger_image from "../fake_data/badger.jpeg";
import fox_image from "../fake_data/fox.jpeg";
import cat_image from "../fake_data/cat.jpg";

let sensor_data = [
    {"type": "camera_trap", "latitude":51.5094, "longitude":-2.5890, "icon": camera_trap_icon, "id": 0,
     "last_event_received": "4 hours ago", "frequency": "one-off", "health": "healthy", "status": "on",
     "created": "01/02/2020", "access": "private", "provenance": "first_hand", "name": "camera_trap_1",
     "drag": false},
    {"type": "unique_public_source","latitude":51.5100,"longitude":-2.5957, "icon": unique_public_source_icon, "id": 1,
     "last_event_received": "4 hours ago", "frequency": "one-off", "health": "healthy", "status": "on",
     "created": "01/02/2020", "access": "private", "provenance": "first_hand", "name": "bristol_pollution",
     "drag": false},
    {"type": "noise_sensor", "latitude":51.5085, "longitude":-2.5950, "icon": noise_sensor_icon, "id": 2,
     "last_event_received": "4 hours ago", "frequency": "one-off", "health": "healthy", "status": "on",
     "created": "01/02/2020", "access": "private", "provenance": "first_hand", "name": "microphone_1",
     "drag": false},
    {"type": "live_camera","latitude":51.5080,"longitude":-2.5925, "icon": live_camera_icon, "id": 3,
     "last_event_received": "4 hours ago", "frequency": "one-off", "health": "healthy", "status": "on",
     "created": "01/02/2020", "access": "private", "provenance": "first_hand", "name": "field_camera_1",
     "drag": false}
];

const detection_data = [
    {'sensor_id': 3, 'type': 'image', 'title': 'Badger', 'image': badger_image, 'time_seen': '8 hours'},
    {'sensor_id': 3, 'type': 'image', 'title': 'Cat', 'image': cat_image, 'time_seen': '2 days'},
    {'sensor_id': 0, 'type': 'image', 'title': 'Fox', 'image': fox_image, 'time_seen': '1 day'},
    {'sensor_id': 2, 'type': 'chart', 'title': 'Noise Level'}
];

export { sensor_data, detection_data };