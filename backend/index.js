import dotenv from 'dotenv'
dotenv.config()

import app from './src/app.js'
// import { logger, requestLogger } from './src/utils/winston.js'

// const PORT = 3001
// app.listen(PORT, () => logger.info({ message: `Server running on port ${PORT}` }));

export default app;
