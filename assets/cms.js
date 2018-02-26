import { OurTeamPreview } from './cms/our-team';
import { ServingPreview } from './cms/serving';

CMS.registerPreviewStyle('/static/css/stcs.css');
CMS.registerPreviewTemplate('our-team', OurTeamPreview);
CMS.registerPreviewTemplate('serving', ServingPreview);
