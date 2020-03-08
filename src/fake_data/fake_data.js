
// Import image
import live_camera_icon from "../icons/live_camera.png";
import camera_trap_icon from "../icons/camera_trap.png";
import unique_public_source_icon from "../icons/unique_public_source.png";

import badger_image from "../fake_data/badger.jpeg";
import fox_image from "../fake_data/fox.jpeg";
import cat_image from "../fake_data/cat.jpg";

let sensor_data = [
    {"type": "camera_trap", "latitude":51.5094, "longitude":-2.5890, "icon": camera_trap_icon, "id": 0,
     "last_event_received": "4 hours ago", "frequency": "one-off", "health": "healthy", "status": "on",
     "created": "01/02/2020", "access": "private", "provenance": "first_hand", "name": "camera_trap_1",
     "drag": false, 'info': 'This shows how we can hook sensors up to external data sources. This pollution ' +
            'sensor is pulling from the Bristol Open Data source, which measures air quality at various locations' +
            'around bristol, amongst other things.'},
    {"type": "custom_external_source","latitude":51.504,"longitude":-2.59, "icon": unique_public_source_icon, "id": 1,
     "last_event_received": "N/A", "frequency": "N/A", "health": "N/A", "status": "on",
     "created": "01/02/2020", "access": "public", "provenance": "second_hand", "name": "bristol_pollution",
     "drag": false},
    {"type": "live_camera","latitude":51.5080,"longitude":-2.5925, "icon": live_camera_icon, "id": 3,
     "last_event_received": "4 hours ago", "frequency": "one-off", "health": "healthy", "status": "on",
     "created": "01/02/2020", "access": "private", "provenance": "first_hand", "name": "field_camera_1",
     "drag": false}
];

const detection_data = [
    {
        'sensor_id': 3,
        'type': 'camera',
        'info': 'This sensor demonstrates a live camera feed making automatic animal detections. Detections ' +
            'allow the ecologist to confirm the presence of a species of animal in the area.',
        'data': [
            {'title': 'Badger', 'image': badger_image, 'time_seen': '8 hours', 'id': 1},
            {'title': 'Cat', 'image': cat_image, 'time_seen': '2 days', 'id': 2}
            ]
    },
    {
        'sensor_id': 0,
        'type': 'camera',
        'info': 'This sensor demonstrates a camera trap currently out in the field. Although data is still' +
            ' collected manually, you can upload those images or videos to this sensor and it will process the ' +
            ' data for you, and organise your data by sensor location and species. This allows the ecologist to ' +
            'confirm the presence of a species of animal in the area.',
        'data': [
            {'title': 'Fox', 'image': fox_image, 'time_seen': '1 day', 'id': 1}
            ]
    },
    {
        'sensor_id': 1,
        'type': 'pollution',
        'title': 'Pollution Level',
        'source': 'luftdaten_pm_bristol',
        'site': 'https://opendata.bristol.gov.uk/explore/dataset/luftdaten_pm_bristol/information/',
        'x_axis_label': 'DateTime',
        'y_axis_label': 'Particulate Matter under 10 micrometers',
        'info': 'This chart shows the PM10 (Particulate Matter under 10 micrometers) at the sensor location. Data' +
            ' is being pulled from the external source.',
        'categories': null,
        'data': null,
        'api': 'https://opendata.bristol.gov.uk/api/records/1.0/search//?dataset=luftdaten_pm_bristol&rows=100&sort=date&refine.sensor_id=34288'}

];

let alert_data = [
    {"id": 1, "name": "badger_alert", "sensor": 3,
        "notification_medium": "an email", "trigger": "detects", "target": "a badger"},
    {"id": 2, "name": "my_pollution_alert", "sensor": 1,
        "notification_medium": "a text", "trigger": "is greater than", "target": "40 ppm"}
];

export { sensor_data, detection_data, alert_data };