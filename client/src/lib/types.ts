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
	type: "text" | "train_list" | "confirmation";
	sender: "ai" | "user";
	trains?: TrainType[];
	ticket?: TicketConfirmationType;
};

export type SocketStateType = {
	socket: Socket;
};

export type TicketConfirmationType = {
	pnr: string;
	train_name: string;
	boarding_time: string;
	coach: string;
	seat: string;
};
