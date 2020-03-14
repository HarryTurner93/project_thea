import badger_image from "../fake_data/badger.jpeg";
import fox_image from "../fake_data/fox.jpeg";
import cat_image from "../fake_data/cat.jpg";

let sensor_data = [
    {"latitude":51.5094, "longitude":-2.5890, "id": 0, "created": "01/02/2020", "name": "Middle of Field", "drag": false},
    {"latitude":51.504,"longitude":-2.59, "id": 1, "created": "01/02/2020", "name": "Behind House", "drag": false}
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

export { sensor_data, detection_data };