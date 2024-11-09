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

export type WidgetType = "text" | "train_list" | "confirmation" | "summary";

export type MessageType = {
	text: string;
	type: WidgetType;
	sender: "ai" | "user";
	trains?: TrainType[];
	ticket?: TicketConfirmationType;
	summary?: SummaryType;
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

export type SummaryType = {
	trainId: string;
	train: string;
	from: string;
	to: string;
	date: string;
	class: string;
	totalFare: string;
	passengers: Array<{
		name: string;
		age: number;
		gender: string;
	}>;
	contact: string;
	upid: string;
};
