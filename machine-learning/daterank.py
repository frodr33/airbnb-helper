import pandas as pd
import matplotlib.pyplot as plt
import pickle
import datetime
import json
import sys
import copy


def main():
	calendar_file = "calendar_nov_3.csv"
	reviews_file = "reviews_nov_3.csv"
	listings_file = "listings_nov_3.csv"

	# reviews_data = pd.read_csv(reviews_file, usecols = ['listing_id', 'date', 'comments'])[['listing_id', 'date', 'comments']]
	# listings_data = pd.read_csv(listings_file, usecols=['id', 'listing_url', 'name', 'summary', 'description', 'notes', 'neighbourhood_cleansed', 'latitude', 'longitude',
	# 	'accommodates', 'amenities', 'minimum_nights', 'maximum_nights'])[['id', 'listing_url', 'name', 'summary', 'description', 'notes', 'neighbourhood_cleansed', 'latitude', 'longitude',
	# 	'accommodates', 'amenities', 'minimum_nights', 'maximum_nights']]
	# #listings_data.to_csv('listings_data_update.csv')

	#list_of_col_vals = listings_data.loc[:]['id']
	# row_val = listings_data.loc[listings_data['id'] == 148259]
	#print (row_val)
	# neighborhood = row_val['neighbourhood_cleansed']
	# print(neighborhood.values[0])
	#print (str(listings_data.iloc(0)))
	# print((list_of_col_vals))
	# print(list_of_col_vals[2515])


	#calendar_dictionary = pickle.load(open("calendar_data.pickle", "rb" ))
	#create_optimized_dictionary(calendar_dictionary)


	optimized_calendar_dictionary = pickle.load(open("optimized_calendar_data.pickle", "rb" ))
	#neighborhood_calendar_dict= pickle.load(open("calendar_with_neighborhood.pickle", "rb"))

	# for key, value in neighborhood_calendar_dict.items():
	# 	print  ('This is the key '+ str(key))
	# 	print ('This is the value' + str(value))

	#optimized_calendar_dictionary = add_neighborhood_listings_values(neighborhood_calendar_dict, optimized_calendar_dictionary)

	# for nextkey, nextvalue in optimized_calendar_dictionary.items():
	# 	print ('This is the optimized calendar  value ' + str(nextkey))
	# 	print ('This is the optimized calendar value ' + str(nextvalue))


	applicable_listings_list = applicable_listings(optimized_calendar_dictionary, 'Harlem')
	start_date = datetime.datetime.strptime('2019-09-01', "%Y-%m-%d")
	end_date = datetime.datetime.strptime('2019-09-10', "%Y-%m-%d")
	list_of_ratios, min_ratio, dict_ratio, best_start_date, best_end_date = average_ratio(applicable_listings_list, optimized_calendar_dictionary, start_date, end_date, 4)
	average_ratio_val = sum(list_of_ratios)/len(list_of_ratios)
	print ('The best start date is ' + str(best_start_date))
	print ('The best end date is ' + str(best_end_date))
	print ('The average ratio is ' + str(average_ratio_val))
	print ('The minimum ratio is ' + str(min_ratio))
	corresponding_listings = dict_ratio[min_ratio]
	print ('These are the corresponding_listings' + str(corresponding_listings))

	# current_end_date = start_date + datetime.timedelta(days=duration_of_stay)
	# print (current_end_date)


def add_neighborhood_listings_values(neighborhood_calendar_dict, optimized_calendar_dictionary):
	dictionary_of_neighborhoods = {}
	for key, value in neighborhood_calendar_dict.items():
		if (value['neighborhood'] != None): 
			if  (value['neighborhood'] not in dictionary_of_neighborhoods):
				dictionary_of_neighborhoods[value['neighborhood']] = [key]
			else:
				dictionary_of_neighborhoods[value['neighborhood']].append(key)
	#rint (dictionary_of_neighborhoods)
	optimized_calendar_dictionary.update(dictionary_of_neighborhoods)
	with open('optimized_calendar_data_2.pickle', 'wb') as handle:
		pickle.dump(optimized_calendar_dictionary, handle, protocol=pickle.HIGHEST_PROTOCOL)

	return optimized_calendar_dictionary


	# 		list_of_applicable_listings.append(key)
	# return list_of_applicable_listings

	# for key, item in neighborhood_calendar_dict.items():
	# 	neighborhood_value  = item['neighborhood']
	# 	#print ('This is the neighborhood value ' +str(neighborhood_value))
	# 	if neighborhood_value in dictionary_of_neighborhoods:
	# 		if (key != None):
	# 			dictionary_of_neighborhoods[neighborhood_value].append(key)
	# 	else:
	# 		if (key != None):
	# 			dictionary_of_neighborhoods[neighborhood_value] = [key]

	# 	print (dictionary_of_neighborhoods)
	# 	if neighborhood_value  in  dictionary_of_neighborhoods:
	# 		dictionary_of_neighborhoods[neighborhood_value] = dictionary_of_neighborhoods[neighborhood_value].add(key)
	# 	else:
	# 		dictionary_of_neighborhoods[neighborhood_value] = {key}
	# 		#print (optimized_calendar_dictionary_2[neighborhood_value])

	# optimized_calendar_dictionary.update(dictionary_of_neighborhoods)
	# with open('optimized_calendar_data_2.pickle', 'wb') as handle:
	# 	pickle.dump(optimized_calendar_dictionary_2, handle, protocol=pickle.HIGHEST_PROTOCOL)
	# return optimized_calendar_dictionary




def average_ratio(applicable_listings_list, optimized_calendar_dictionary, start_date, end_date, duration_of_stay):
	list_of_ratios = []
	min_ratio = 1
	best_start_date = start_date
	best_end_date = end_date

	ratio_listing_dict = {}
	total_listings = len(applicable_listings_list)
	current_end_date = start_date + datetime.timedelta(days=duration_of_stay)
	while (current_end_date < end_date):
		list_of_possible_homes = []
		for listing_value in applicable_listings_list:
			if (check_date_range(start_date, current_end_date, listing_value, optimized_calendar_dictionary)):
				list_of_possible_homes.append(listing_value)
		ratio_val = len(list_of_possible_homes)/float(total_listings)
		if (ratio_val < min_ratio):
			min_ratio = ratio_val
			# print (start_date)
			# print (current_end_date)
			best_start_date = start_date
			best_end_date = current_end_date
			# print (best_start_date)
			# print (best_end_date)

		list_of_ratios.append(ratio_val)
		ratio_listing_dict[ratio_val] = list_of_possible_homes
		start_date += datetime.timedelta(days=1)
		current_end_date = start_date + datetime.timedelta(days=duration_of_stay)

	return (list_of_ratios, min_ratio, ratio_listing_dict, best_start_date, best_end_date)



def applicable_listings(optimized_calendar_dict, entered_neighborhood):
	if entered_neighborhood in optimized_calendar_dict:
		return optimized_calendar_dict[entered_neighborhood]
	else:
		print ('There was an error. ')
	# list_of_applicable_listings = []
	# for key, value in neighborhood_calendar_dict.items():
	# 	if (value['neighborhood'] == entered_neighborhood):
	# 		list_of_applicable_listings.append(key)
	# return list_of_applicable_listings


def add_neighborhood_data(optimized_calendar_dictionary):
	for key, value in optimized_calendar_dictionary.items():
		row_val = listings_data.loc[listings_data['id'] == int(key)]
		neighborhood_value = ''
		try:
			neighborhood = row_val['neighbourhood_cleansed']
			neighborhood_value = neighborhood.values[0]
		except:
			print ('Value did not exist.')

		value['neighborhood'] = neighborhood_value
		optimized_calendar_dictionary[key] = value
	with open('calendar_with_neighborhood.pickle', 'wb') as handle:
		pickle.dump(optimized_calendar_dictionary, handle, protocol=pickle.HIGHEST_PROTOCOL)

def check_date_range(start_date, end_date, listing, optimized_dictionary):
	dictionary_of_dates = optimized_dictionary[listing]
	#first_date_time_object = datetime.datetime.strptime(start_date, "%Y-%m-%d")
	#end_date_time_object = datetime.datetime.strptime(end_date, "%Y-%m-%d")
	for single_date in pd.date_range(start_date, end_date):
		single_date_time_object = single_date
		#single_date_time_object = datetime.datetime.strptime(start_date, "%Y-%m-%d")
		if single_date_time_object not in dictionary_of_dates:
			return False
		if (dictionary_of_dates[single_date_time_object] == 'f'):
			return False
	return True



def create_optimized_dictionary(calendar_dictionary):
	for key, value in calendar_dictionary.items():
		dict_value_info  = calendar_date_dict(value)
		optimized_dictionary[key] = dict_value_info
	with open('optimized_calendar_data.pickle', 'wb') as handle:
		pickle.dump(optimized_dictionary, handle, protocol=pickle.HIGHEST_PROTOCOL)
	#print (optimized_dictionary)



def calendar_date_dict(tuple_list):
	dict_of_dates = {}
	for date_val, t_f_val in tuple_list:
		datetime_object = datetime.datetime.strptime(date_val, "%Y-%m-%d")
		if (t_f_val == 't'):
			dict_of_dates[datetime_object] = 't'
		if (t_f_val == 'f'):
			dict_of_dates[datetime_object] = 'f'
	# available_list.sort()
	# not_available_list.sort()
	# print ('THIS IS THE AVAILABLE LIST')
	# print (str(available_list))
	# print ('THIS IS THE NOT AVAILABLE LIST')
	# print (str(not_available_list))
	# return (available_list, not_available_list)
	return dict_of_dates


def create_calendar_pickle():
	calendar_data = pd.read_csv(calendar_file, usecols = ['listing_id', 'date', 'available'])[['listing_id', 'date', 'available']]
	calendar_data.dropna()
	dictionary_of_calendar_data = {}
	possible_listing_ids = calendar_data['listing_id']
	possible_listing_ids_set = set(possible_listing_ids)

	print (len(possible_listing_ids_set))
	for index, row in calendar_data.iterrows():
		listing_id = row['listing_id']
		date = row['date']
		available = row['available']
		if listing_id in dictionary_of_calendar_data:
			current_date_range  = dictionary_of_calendar_data[listing_id]
			current_date_range.append((date, available))
		else:
			dictionary_of_calendar_data[listing_id] = [(date, available)]

	print (dictionary_of_calendar_data)
	print (len(dictionary_of_calendar_data))

	with open('calendar_data.pickle', 'wb') as handle:
		pickle.dump(dictionary_of_calendar_data, handle, protocol=pickle.HIGHEST_PROTOCOL)

if __name__ == '__main__':
	# d = sys.argv[1]
	# d = json.loads(data)
    # destination, max_price, date_range = d["destination"], d["maxPrice"], d["dates"]
    # number_adults, neighborhood, keywords = d["numberAdults"], d["neighborhood"], d["keywords"]

    main()

	# To send back to javascript to this
	# res = list_of_listing_ids
	# print(res)
	# sys.stdout.flush()
