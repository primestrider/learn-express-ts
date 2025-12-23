import { logger } from "./application/logging";
import { web } from "./application/web";

web.listen(4750, () => {
  logger.info("Listening on port 4750");
});
