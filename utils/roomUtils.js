import {roomOptions} from "../config/roomConfig";

export function isPrivateRoom(room) {
    const roomOption = roomOptions.find(option => option.value === room);
    return roomOption.roomId === null;
}