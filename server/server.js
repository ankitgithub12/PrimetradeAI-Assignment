import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import connectDB from './config/db.js';

// Security packages
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Route files
import auth from './routes/auth.js';
import tasks from './routes/tasks.js';

import errorHandler from './middleware/error.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Set security headers (protects against XSS and sniffing)
app.use(helmet());

// Rate limiting (100 requests per 10 mins)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100
});
app.use(limiter);

// Enable CORS
app.use(cors());

// Mount routersn   
app.use('/api/v1/auth', auth);
app.use('/api/v1/tasks', tasks);

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
