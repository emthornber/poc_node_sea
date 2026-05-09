const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const {
	todoRoutes,
	healthCheckRoutes
} = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cors());

app.get('/', (req, res) => {
	res.json({
		status: true
	})
});

app.use('/health', healthCheckRoutes);
app.use('/todo', todoRoutes);

module.exports = app;