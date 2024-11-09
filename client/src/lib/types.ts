import type { Socket } from "socket.io-client";

export type TrainType = {
	train_name: string;
	train_id: string;
	departure_station: string;
	departure_time: string;
	arrival_station: string;
	arrival_time: string;
	classes: [
		{
			class_type: string;
			fare: string;
			seats_available: string;
		},
		{
			class_type: string;
			fare: string;
			seats_available: string;
		},
	];
};

export type MessageType = {
	text: string;
	type: "text" | "train_list";
	sender: "ai" | "user";
	trains?: TrainType[];
};

export type SocketStateType = {
	socket: Socket;
};
