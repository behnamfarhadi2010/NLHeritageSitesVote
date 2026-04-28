import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sitesRouter from "./sites";
import matchupRouter from "./matchup";
import votesRouter from "./votes";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sitesRouter);
router.use(matchupRouter);
router.use(votesRouter);
router.use(statsRouter);

export default router;
