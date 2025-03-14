import { RequestHandler, Router } from "express";
import { validateAccessToken } from "../helper/validateToken";
import { create_event, event_payment, event_payment_webhook, event_registration, fetch_nigerian_banks } from "../controller/event.controller";

const router = Router();

router.get("/get_banks", fetch_nigerian_banks as RequestHandler);
router.post("/create_event", validateAccessToken as RequestHandler, create_event as RequestHandler);
router.post("/event_registration", validateAccessToken as RequestHandler, event_registration as RequestHandler);
router.post("/event_payment", validateAccessToken as RequestHandler, event_payment as RequestHandler);
router.post("/event_payment_hook", validateAccessToken as RequestHandler, event_payment_webhook as RequestHandler);

export { router as eventRouter };
