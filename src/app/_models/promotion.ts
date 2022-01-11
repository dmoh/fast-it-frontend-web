import {promotionApplicationTo} from "@app/_util/fasteat-constants";

export class Promotion {
    id: number = 0;
    percentage: number = 0.0;
    code: string = '';
    enable: boolean = true;
    totalAmountProduct = 0;
    totalAmountProductWithPromotion= 0;
    dateBegin: {date};
    dateEnd: {date};
    applicatedTo: number = promotionApplicationTo.FAST_IT;
    deleted: boolean = false;
    restaurants: any[] = [];
    sectors: any[] = [];
    clients: any[] = [];
}
