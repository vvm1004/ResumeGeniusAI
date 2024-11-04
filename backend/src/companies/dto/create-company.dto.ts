import { IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
   
    @IsNotEmpty({
        message: "Name không được để trống"
    })
    name: string;
    @IsNotEmpty({
        message: "Address không được để trống"
    })
    address: string;

    @IsNotEmpty({
        message: "Description không được để trống"
    })
    description: string;

    @IsNotEmpty({
        message: "Logo không được để trống"
    })
    logo: string;

    @IsNotEmpty({
        message: "Image không được để trống"
    })
    image: string;

    @IsNotEmpty({
        message: "linkUrl không được để trống"
    })
    linkUrl: string;

    @IsNotEmpty({
        message: "minScale không được để trống"
    })
    minScale: number;


    @IsNotEmpty({
        message: "maxScale không được để trống"
    })
    maxScale: number;
}
