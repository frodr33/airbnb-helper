import json, requests
def get_nearby_recommendations(latitude=40.7128, longitude=-74.0060, limit=10):
    ''' Returns up to <limit> venues at specified longitude and latitude (default to NYC)
     '''
    url = 'https://api.foursquare.com/v2/venues/explore'
    params = dict(
    client_id='JMYTOQPFE1ZIWXAMYNHLV0KPOR4I32U3A2VMW1T2NLAOUQ1B',
    client_secret='XD1ZO2PZGS2H0ZWXHJ0NOPVZKJEGKAVP5TY1K00GKFTB2W2I',
    v='20180323',
    ll='{0},{1}'.format(latitude, longitude),
    #   query='coffee',
    limit=limit
    )
    resp = requests.get(url=url, params=params)
    data = json.loads(resp.text)
    venues = data['response']['groups']
    return venues