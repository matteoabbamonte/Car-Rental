
class Rental {
    constructor(par1, par2, start_date, end_date, price) {
        if (price) {
            this.carBrand = par1;
            this.carModel = par2;
            this.startDate = start_date;
            this.endDate = end_date;
            this.price = price;
        } else {
            this.car_id = par1;
            this.user_id = par2;
            this.start_date = start_date;
            this.end_date = end_date;
        }
    }
}

export default Rental;