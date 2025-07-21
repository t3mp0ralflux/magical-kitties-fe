import { EndowmentUpdate } from "./endowmentupdate.model";

export interface UpdateCharacterAttributes {
    characterId: string;
    cute?: number;
    cunning?: number;
    fierce?: number;
    level?: number;
    xp?: number;
    currentOwies?: number;
    currentTreats?: number;
    currentInjuries?: number;
    incapacitated?: boolean;
    flawChange?: EndowmentUpdate;
    talentChange?: EndowmentUpdate;
    magicalPowerChange?: EndowmentUpdate;
}