import pandas as pd
import pickle
import re

def main():
	get_neighborhood_values()
	#neighborhood_listing_dict = pickle.load(open("san_francisco_neighborhood_listing_data_2.pickle", "rb" ))
	#find_applicable_prices(neighborhood_listing_dict, 'Western Addition', 200.0,)

def get_neighborhood_values():
	dict_of_listings = {}
	listings_file = "listings.csv"
	listings_data = pd.read_csv(listings_file, usecols=['id',  'neighbourhood_cleansed','price', 'review_scores_rating'])[['id', 'neighbourhood_cleansed','price', 'review_scores_rating']]
	listings_data = listings_data.dropna()
	for index, row in listings_data.iterrows():
		id_val = row['id']
		string_price_val = row['price']
		price_val = float(re.sub("[^0-9.]", "", string_price_val))
		review_score_val = row['review_scores_rating']/float(10.0)
		neighborhood = row['neighbourhood_cleansed']
		tuple_of_values = (id_val, price_val, review_score_val)
		if (neighborhood in dict_of_listings):
			old_list = dict_of_listings[neighborhood]
			old_list.append(tuple_of_values)
			dict_of_listings[neighborhood] = old_list
		else:
			dict_of_listings[neighborhood] = [tuple_of_values]


	with open('boston_neighborhood_listing_data.pickle', 'wb') as handle:
		pickle.dump(dict_of_listings, handle, protocol=pickle.HIGHEST_PROTOCOL)

	#print (dict_of_listings)

def find_applicable_prices(listing_dictionary, neighborhood, maximum_price):
	neighborhood_tuple_list = listing_dictionary[neighborhood]
	dict_id_review = {}
	price_value_list = []
	for x, y, z in neighborhood_tuple_list:
		if (y < maximum_price):
			tuple_val = (x,y,z)
			price_value_list.append(x)
			dict_id_review[x] = z
			#price_value_list.append(tuple_val)

	#print (price_value_list)
	print (price_value_list)
	print (dict_id_review)
	return (price_value_list, dict_id_review)




if __name__ == '__main__':
    main()