import { PartialType } from "@nestjs/mapped-types";
import { CreateStoreByCepDto } from "./createStoreByCepDto";

export class UpdateStoreDto extends PartialType(CreateStoreByCepDto){

}