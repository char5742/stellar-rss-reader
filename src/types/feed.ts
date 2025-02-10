export interface Feed {
	id: string;
	title: string;
	url: string;
	categoryIds: string[];
	description?: string;
	lastUpdated?: Date;
	imageUrl?: string;
}

export interface Category {
	id: string;
	name: string;
	color?: string;
}

export interface FeedWithCategories extends Feed {
	categories: Category[];
}
