export class VehicleModel {

    driverContact: string;
    driverLicence: string;
    driverName: string;
    id: number;
    isActive: string;
    manufactureYear: string;
    note: string;
    vehicleModel: string;
    vehicleNo: string;
    isSaved: number;

    clear() {
        this.driverContact= '';
        this.driverLicence= '';
        this.driverName= '';
        this.id= 0;
        this.isActive= '';
        this.manufactureYear= '';
        this.note= '';
        this.vehicleModel= '';
        this.vehicleNo= '';
        this.isSaved = 0;
    }
    constructor(id:number,vehicleNo:string,isSaved:number){
        this.id=id;
        this.vehicleNo=vehicleNo;
        this.isSaved = isSaved;
    }
}

export class VehiclesModel {

    driverContact: string;
    driverLicence: string;
    driverName: string;
    id: number;
    isActive: string;
    manufactureYear: string;
    note: string;
    vehicleModel: string;
    vehicleNo: string;
    isSaved: number;
    clear() {
        this.driverContact= '';
        this.driverLicence= '';
        this.driverName= '';
        this.id= 0;
        this.isActive= '';
        this.manufactureYear= '';
        this.note= '';
        this.vehicleModel= '';
        this.vehicleNo= '';
        this.isSaved = 0;
    }
    constructor(id:number,vehicleNo:string,isSaved:number){
        this.id=id;
        this.vehicleNo=vehicleNo;
        this.isSaved = isSaved;
    }
}