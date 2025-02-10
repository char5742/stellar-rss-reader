import { createFileRoute } from '@tanstack/react-router';
import { CategoryManager } from '~/feed/interface/components/CategoryManager';
import { AddFeedForm } from '~/feed/interface/components/AddFeedForm';
import { FeedList } from '~/feed/interface/components/FeedList';

export const Route = createFileRoute('/feeds')({
	component: () => (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">フィード管理</h1>

			<div className="grid gap-6 md:grid-cols-2">
				<div>
					<AddFeedForm />
					<div className="mt-6">
						<CategoryManager />
					</div>
				</div>

				<div>
					<FeedList />
				</div>
			</div>
		</div>
	),
});
