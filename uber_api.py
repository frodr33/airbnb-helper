from uber_rides.session import Session
from uber_rides.client import UberRidesClient




server_token = 'WFldMoj7parIbXJLHJjVMsYhfs7qBDHFS02PTtkK'
session = Session(server_token=server_token)
client = UberRidesClient(session)

def get_uber_estimate(start_lat, start_long, end_lat, end_long, pool_seats=2):
    '''Returns the price estimates for different types of ubers
    rtype=dict
    format:
    {
        uber_type: {
            price_estimate: $dollar_value,
            time_estimate: minutes to arrive
        }
        }'''
    price_response = client.get_price_estimates(
        start_latitude=start_lat,
        start_longitude=start_long,
        end_latitude=end_lat,
        end_longitude=end_long,
        seat_count=pool_seats
    )
    
    uber_estimate_dict = dict()
    for uber_type in price_response.json.get('prices'):
        if uber_type['localized_display_name'] == 'Taxi':
            continue
        inner_dict = dict()
        duration_in_minutes = uber_type['duration'] / 60  # api gives in seconds
        price = (uber_type['low_estimate'] + uber_type['high_estimate']) / 2
        inner_dict['price'] = price
        inner_dict['time_estimate'] = duration_in_minutes
        uber_estimate_dict[uber_type['localized_display_name']] = inner_dict
    print(uber_estimate_dict)
    return uber_estimate_dict
    

    