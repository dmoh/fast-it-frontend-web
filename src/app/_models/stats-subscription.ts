import {User} from "@app/_models/user";

export class StatsSubscription {
    id: number;
    name: string;
    counterSubscription: number;
    artistName: string;
    nbTargetSubscription: number;
    artist: {};
    nbSubBasic: number;
    nbSubMedium: number;
    nbSubPremium: number;
}
