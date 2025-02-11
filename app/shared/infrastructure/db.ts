import { createRxDatabase } from 'rxdb/plugins/core';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

export const database = await createRxDatabase({
	name: 'stellar-rss-reader',
	storage: wrappedValidateAjvStorage({
		storage: getRxStorageDexie(),
	}),
});
