export default class Utils {

    static assetsDepreciationAnnual(price: number, UseTime: number) {
        if (isNaN(+price) || isNaN(+UseTime)  || UseTime == 0) return 0;
        // switch (DepreType){
            // case 1:
        // switch (timeUnit) {
        //     case 1:

                return Math.floor((price *(1/UseTime)));
    
  
            // case 2:
            //     if (isNaN(+UseTime) || UseTime < 12) return price;
            //     else {
            //         return Math.floor((price / UseTime) * 12);
            //         break;
            //     }
            

            // default:
            //     return 0
            //     break;
        
        // case 2:
        //     if (isNaN(+UseTime) ||  UseTime <= 4 ) {
        //         return Math.floor((price *(1/UseTime)* (3/2)))
                
        //     } else {
        //         return Math.floor((price *(1/UseTime)* 2))
        //         break;
        //     }
        //     default:
        //          return 0
        //          break;
        //       case 3:
        //           return Math.floor ((price/Quantity)*Wattage)
        //           break;
        
        // }
    }
    static assetsDepreciationMonthly(price: number, UseTime: number) {

        if (isNaN(+price) || isNaN(+UseTime) || UseTime == 0) return 0;
        // switch (DepreType){
        //     case 1:
        // switch (timeUnit) {
        //     case 1:

                return Math.floor((price * (1/UseTime)) / 12);
                // break;
            // case 2:

            //     return Math.floor((price / UseTime));\
        
            //     break;

            // default:
            //     return 0
            //     break;
        //     case 2:
        //         if (isNaN(+UseTime) ||  UseTime <= 4 ) {
        //             return Math.floor(((price *(1/UseTime)* (3/2))/12))
                    
        //         } else {
        //             return Math.floor(((price *(1/UseTime)* 2)/12))
        //             break;
        //         }
        //         default:
        //              return 0
        //              break;

        //     case 3:
        //         return Math.floor (((price/Quantity)*Wattage)/12)
        //         break;
                   
        // }
    }

    
    static assetsDepreciationDepreRate(UseTime: number) {

        if (isNaN(+UseTime) || UseTime == 0) return 0;
        // switch (DepreType){
        //     case 1:
        // switch (timeUnit) {
        //     case 1:
                return Math.floor((1 / UseTime)*100);
        //         break;
        //     case 2:
        //         if (isNaN(+UseTime) ||  UseTime <= 4 ) {
        //             return Math.floor((1/UseTime)* (3/2)*100)
                    
        //         } else {
        //             return Math.floor((1/UseTime)*2*100)
        //             break;
        //         }
        //         default:2
        //              return 0
        //              break;
        // }
}
    static hasAction(code: string) {
        let ACTION_KEY = 'usr_action'
        var actions = JSON.parse(localStorage.getItem(ACTION_KEY) || '{}') || {};
        console.log(actions);
        console.log(code);
        if (actions.length > 0) {
            return true;
        }
        return false;
    }

}