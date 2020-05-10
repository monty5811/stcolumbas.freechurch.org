import { ChurchPlantsPreview } from "./cms/church-plants";
import { CommunityPreview } from "./cms/community";
import { MinistriesPreview } from "./cms/ministries";
import { OurTeamPreview } from "./cms/our-team";
import { OurVisionPreview } from "./cms/our-vision";
import { ServingPreview } from "./cms/serving";
import { HeadlinePreview } from "./cms/headline";

CMS.registerPreviewStyle("/static/css/stcs.css");
CMS.registerPreviewTemplate("church-plants", ChurchPlantsPreview);
CMS.registerPreviewTemplate("community", CommunityPreview);
CMS.registerPreviewTemplate("ministries", MinistriesPreview);
CMS.registerPreviewTemplate("our-team", OurTeamPreview);
CMS.registerPreviewTemplate("our-vision", OurVisionPreview);
CMS.registerPreviewTemplate("serving", ServingPreview);
CMS.registerPreviewTemplate("headline", HeadlinePreview);
