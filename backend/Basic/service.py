import math
from .models import Population_2011

def Airthemetic_d_values(subdistrict):
    subdistrict_new_ids = [x['id'] for x in subdistrict]
    print("subdistrict_new_ids", subdistrict_new_ids)
        
        # Get population data for subdistricts
    subdistrict_2011 = list(Population_2011.objects.filter(
        subdistrict_code__in=subdistrict_new_ids
    ).values(
        'subdistrict_code', 'population_1951', 'population_1961', 
        'population_1971', 'population_1981', 'population_1991', 
        'population_2001', 'population_2011'
    ))
    
    print("subdistrict_2011",subdistrict_2011)
    
    # Calculate the total population for each decade
   
    d_values = []
    for subdistrict in subdistrict_2011:
        d_mean=(subdistrict['population_2011']-subdistrict['population_1951'])/6
        annual_growth_rate =math.floor(d_mean / 10)
        temp={
            "subdistrict_code": subdistrict['subdistrict_code'],
            "annual_growth_rate":annual_growth_rate,
            "total_p7":subdistrict['population_2011']
        }
        d_values.append(temp)

    return d_values
        
def Airthemtic_population_single_year(base_year,single_year,villages,subdistrict):
    print("villages props")
    output_year = {}
    ans=Airthemetic_d_values(subdistrict)
    if single_year:
        target_year = int(single_year)
        for village in villages: 
            print("village", village)
            village_id, value ,vill_sub_id= village['id'],village['population'],village['subDistrictId']
            items= next(item for item in ans if item['subdistrict_code'] == vill_sub_id)
            output_year[village_id] = {
                "2011": value,
                str(target_year): int(value + ((items['annual_growth_rate'] * (target_year - base_year)) * (value / items['total_p7'])))
            }
        Air_last_output={}
        Air_last_output['2011']=sum([values['2011'] for values in output_year.values()])
        Air_last_output[target_year]=sum([values[str(target_year)] for values in output_year.values()])
        print('Air_last_output',Air_last_output)
    return Air_last_output



def Geometirc_d_values(subdistrict):
    subdistrict_new_ids = [x['id'] for x in subdistrict]
    print("subdistrict_new_ids", subdistrict_new_ids)
        
        # Get population data for subdistricts
    subdistrict_2011 = list(Population_2011.objects.filter(
        subdistrict_code__in=subdistrict_new_ids
    ).values(
        'subdistrict_code', 'population_1951', 'population_1961', 
        'population_1971', 'population_1981', 'population_1991', 
        'population_2001', 'population_2011'
    ))
    
    print("subdistrict_2011",subdistrict_2011)
    
    # Calculate the total population for each decade
   
    d_values = []
    for subdistrict in subdistrict_2011:
        d_mean=(subdistrict['population_2011']-subdistrict['population_1951'])/6
        annual_growth_rate =math.floor(d_mean / 10)
        temp={
            "subdistrict_code": subdistrict['subdistrict_code'],
            "annual_growth_rate":annual_growth_rate,
            "total_p7":subdistrict['population_2011']
        }
        d_values.append(temp)

    return d_values


def geometric_population_single_year(base_year,single_year,villages,subdistrict):
    output_year = {}
    ans=Geometirc_d_values(subdistrict)
    if single_year:
        target_year = int(single_year)
        for village in villages: 
            print("village", village)
            village_id, value ,vill_sub_id= village['id'],village['population'],village['subDistrictId']
            items= next(item for item in ans if item['subdistrict_code'] == vill_sub_id)
            output_year[village_id] = {
                "2011": value,
                str(target_year): int(value + ((items['annual_growth_rate'] * (target_year - base_year)) * (value / items['total_p7'])))
            }
        Air_last_output={}
        Air_last_output['2011']=sum([values['2011'] for values in output_year.values()])
        Air_last_output[target_year]=sum([values[str(target_year)] for values in output_year.values()])
        print('Air_last_output',Air_last_output)
    return Air_last_output




# def population_range(base_year,start_year,end_year,villages,subdistrict):
#     annual_growth_rate,total_p7=get_total_p7(subdistrict)
#     start_yr = int(start_year)
#     end_yr = int(end_year)
#     output_year = {}        
#     for village in villages:
#         village_id, value = village['id'],village['population'] 
#         output_year[village_id] = {"2011": value}
#         for year in range(start_yr, end_yr + 1):
#             if year != 2011:  
#                 projected_pop = int(value + ((annual_growth_rate * (year - base_year)) * (value / total_p7)))
#             output_year[village_id][str(year)] = projected_pop
#     return output_year


def geometry_single_year(base_year,single_year,villages,subdistrict):
    output_year = {}
    if single_year:
        target_year = int(single_year)
        # Process each village
        for village in villages: 
            village_id, value = village['id'],village['geometry'] 
            output_year[village_id] = {
                "2011": value,
                str(target_year): value
            }
    return output_year