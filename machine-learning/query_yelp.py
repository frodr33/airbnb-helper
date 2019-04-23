# -*- coding: utf-8 -*-
"""
This program demonstrates the capability of the Yelp Fusion API
by using the Search API to query for businesses by a search term and location,
and the Business API to query additional information about the top result
from the search query.

Please refer to http://www.yelp.com/developers/v3/documentation for the API
documentation.

This program requires the Python requests library, which you can install via:
`pip install -r requirements.txt`.

"""
from __future__ import print_function

import argparse
import json
import requests
import sys
import urllib
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.parse import urlencode
from decimal import Decimal
import pickle 

#Basic stuff to query the API 
API_KEY = 'rKs47AtMFAKFD1bHjlNSfEdONcInTie98nkMuR-_x0wKDoX19IX70LBmNy98UIK2mBdBdiQisnoLrukq4bzGvsacGdbGPfwq9h6t0rulHOlM2w8XLd8MgB4MRr68XHYx'

# API constants, you shouldn't have to change these.
API_HOST = 'https://api.yelp.com'
SEARCH_PATH = '/v3/businesses/search'
BUSINESS_PATH = '/v3/businesses/'  # Business ID will come after slash.

#Dictionary to classify sentiment
word_sentiment_dictionary = pickle.load(open("./machine-learning/word_sentiment.pickle", "rb" ))


# Search default because the Free API Limit is 5000 returned queries
SEARCH_LIMIT = 5



def main():
    try:
        #Sample Latitude and Longitude Data
        # term = 'dinner' 
        # lat = Decimal(37.782907)
        # longi  = Decimal(-122.418898)
        # radius = None
       # d = {"term":"dinner","latitude":37.782907, "longitude": -122.418898, "radius": 3200}

        testing = False
        if testing:
            term = 'dinner' 
            lat = Decimal(37.782907)
            longi  = Decimal(-122.418898)
            # radius = None
        else:
            d = sys.argv[1]
            d = json.loads(d)
            term = d['term']
            lat = d['latitude']
            longi = d['longitude']
        #Radius Value

        #Sample query
        radius = None
        if radius is not None:
            query_api_lat_Long(term, lat, longi, radius)
        else:
            res = query_api_lat_Long(term, lat, longi)
            print(res)


    except Exception as e:
        print("Exception" + " " + e)
    sys.stdout.flush()

def request(host, path, api_key, url_params=None):
    """Given your API_KEY, send a GET request to the API.

    Args:
        host (str): The domain host of the API.
        path (str): The path of the API after the domain.
        API_KEY (str): Your API Key.
        url_params (dict): An optional set of query parameters in the request.

    Returns:
        dict: The JSON response from the request.

    Raises:
        HTTPError: An error occurs from the HTTP request.
    """
    url_params = url_params or {}
    url = '{0}{1}'.format(host, quote(path.encode('utf8')))
    headers = {
        'Authorization': 'Bearer %s' % api_key,
    }

    #print(u'Querying {0} ...'.format(url))

    response = requests.request('GET', url, headers=headers, params=url_params)

    return response.json()

def search_with_lat_long(api_key, term, latitude, longitude, radius):
    """Query the Search API by a search term and location.

    Args:
        term (str): The search term passed to the API.
        location (str): The search location passed to the API.

    Returns:
        dict: The JSON response from the request.
    """

    url_params = {
        'term': term.replace(' ', '+'),
        'latitude': latitude,
        'longitude': longitude,
        'limit': SEARCH_LIMIT
    }
    return request(API_HOST, SEARCH_PATH, api_key, url_params=url_params)


#Reviews
def get_reviews_for_business(api_key, business_id, current_rating):
    reviews_path = BUSINESS_PATH+business_id+'/reviews'
    average_rating = 0.0
    overall_sentiment = 0.0
    request_val = request(API_HOST, reviews_path, api_key)
    reviews = request_val['reviews']
    #print (reviews)
    for value in reviews:
        #print ('This is the value '+ str(value))
        positive_word_count = 0.0
        negative_word_count = 0.0
        average_rating += value['rating']
        text_review = value['text']
        split_of_words = text_review.split()
        for word in text_review.split():
            if word in word_sentiment_dictionary:
                if (word_sentiment_dictionary[word] == 1):
                    positive_word_count +=1
                else:
                    negative_word_count +=1
        difference_in_sentiment = positive_word_count-negative_word_count
        total_value = difference_in_sentiment/(len(split_of_words))
        overall_sentiment += total_value

    average_sentiment = overall_sentiment/3.0
    aggregate_rating = average_rating/3.0
    total_rating = create_business_value(current_rating, aggregate_rating, average_sentiment)
    return total_rating


def create_business_value(overall_star_ranking, average_ranking_review, review_sentiment):
    sentiment_points = 0
    if (review_sentiment > 0.25):
        sentiment_points = 1
    elif (review_sentiment >0):
        sentiment_points = 0.5
    elif (review_sentiment <0):
        sentiment_points =  -0.5
    elif  (review_sentiment < -0.25):
        sentiment_points = -1

    total_ranking = overall_star_ranking+(0.5*average_ranking_review)+sentiment_points
    average_ranking = total_ranking/3.0
    return average_ranking

   # print (request_val)

def get_business(api_key, business_id):
    """Query the Business API by a business ID.

    Args:
        business_id (str): The ID of the business to query.

    Returns:
        dict: The JSON response from the request.
    """
    business_path = BUSINESS_PATH + business_id

    return request(API_HOST, business_path, api_key) 

def query_api_lat_Long(term, latitude, longitude, radius= 40000):
    """Queries the API by the input values from the user.

    Args:
        term (str): The search term to query.
        location (str): The location of the business to query.
    """
    response = search_with_lat_long(API_KEY, term, Decimal(latitude), Decimal(longitude), radius)
    #print (response)
    list_of_results = []

    businesses = response.get('businesses')
    if not businesses:
        #print(u'No businesses for {0} in {1} found.'.format(term, location))
        #print ('no businesses found')
        empty_list = []
        result = json.dumps({"results":empty_list})
        return result
    for value in businesses:
        business_id = value['id']
        response = get_business(API_KEY, business_id)
        #print (response)
        total_ranking = get_reviews_for_business(API_KEY, business_id, response['rating'])
        lat_long_tuple = (response['coordinates']['latitude'], response['coordinates']['longitude'])
        tuple_of_data = (total_ranking, response['name'], response['image_url'], response['categories'][0]['title'], lat_long_tuple)
        list_of_results.append(tuple_of_data)


    list_of_results.sort()
    list_of_results.reverse()
    result = json.dumps({"results":list_of_results})
    return result


if __name__ == '__main__':
    main()
