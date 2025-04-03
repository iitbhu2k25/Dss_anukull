from Basic.models import Basic_state, Basic_district, Basic_subdistrict, Basic_village, Population_2011
from Basic.serializers import StateSerializer,DistrictSerializer,SubDistrictSerializer,VillageSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import math
from .service import *

class Locations_stateAPI(APIView):
    def get(self,request,format=None):
        states=Basic_state.objects.all()
        serial=StateSerializer(states,many=True)
        sorted_data = sorted(serial.data, key=lambda x: x['state_name'])
        return Response(sorted_data,status=status.HTTP_200_OK)
    
class Locations_districtAPI(APIView):
    def post(self,request,format=None):
        district=Basic_district.objects.all().filter(state_code=request.data['state_code'])
        serial=DistrictSerializer(district,many=True)
        sorted_data=sorted(serial.data,key=lambda x: x['district_name'])
        return Response(sorted_data,status=status.HTTP_200_OK)
    
class Locations_subdistrictAPI(APIView):
    def post(self,request,format=None):
        print(request.data['district_code'])
        subdistrict=Basic_subdistrict.objects.all().filter(district_code__in=request.data['district_code'])
        serial=SubDistrictSerializer(subdistrict,many=True)
        sorted_data=sorted(serial.data,key=lambda x: x['subdistrict_name'])
        return Response(sorted_data,status=status.HTTP_200_OK)

class Locations_villageAPI(APIView):
    def post(self,request,format=None):
        village=Basic_village.objects.all().filter(subdistrict_code__in=request.data['subdistrict_code'])
        serial=VillageSerializer(village,many=True)
        sorted_data=sorted(serial.data,key=lambda x:x ['village_name'])
        return Response(sorted_data,status=status.HTTP_200_OK)

class Demographic(APIView):
    def post(self, request, format=None):
        
        base_year = 2011
        # Get data from request
        print('request_data is ',request.data)
        single_year = request.data['year']
        start_year = request.data['start_year']
        end_year = request.data['end_year']
        villages = request.data['villages_props']
        subdistrict = request.data['subdistrict_props']
        total_population = request.data['totalPopulation_props']
        demographic = request.data['demographic']

        print(f"demographic {demographic}")
        annual_birth_rate = demographic['birthRate']
        annual_death_rate = demographic['deathRate']
        annual_emigration_rate = demographic['emigrationRate']
        annual_immigration_rate = demographic['immigrationRate']

        annual_birth_rate = annual_birth_rate/10000
        annual_death_rate = annual_death_rate/10000
        annual_emigration_rate = annual_emigration_rate/10000
        annual_immigration_rate = annual_immigration_rate/10000
        

        # Correcting the subdistrict_id of the villages coming from frontend 
        # Fetch all villages from the database
        village_data = Basic_village.objects.values('village_code', 'subdistrict_code')
        # Create a mapping of village_code to subdistrict_code
        village_mapping = {v['village_code']: v['subdistrict_code'] for v in village_data}
        # Update the villages list with the correct subDistrictId
        for village in villages:
            village_code = village['id']
            if village_code in village_mapping:
                village['subDistrictId'] = village_mapping[village_code]

        main_output={}

        if single_year:
            main_output['demographic'] = Demographic_population_single_year(base_year,single_year,villages,subdistrict,annual_birth_rate,annual_death_rate,annual_emigration_rate,annual_immigration_rate)  
              
        elif start_year and end_year:
            main_output['demographic'] = Demographic_population_range(base_year, start_year, end_year, villages, subdistrict, annual_birth_rate, annual_death_rate, annual_emigration_rate, annual_immigration_rate) 
        print("output",main_output)
        return Response(main_output, status=status.HTTP_200_OK)    
class Time_series(APIView):
    def post(self, request, format=None):
        base_year = 2011
        # Get data from request
        print('request_data is ',request.data)
        single_year = request.data['year']
        start_year = request.data['start_year']
        end_year = request.data['end_year']
        villages = request.data['villages_props']
        subdistrict = request.data['subdistrict_props']
        total_population = request.data['totalPopulation_props']
        

        # Correcting the subdistrict_id of the villages coming from frontend 
        # Fetch all villages from the database
        village_data = Basic_village.objects.values('village_code', 'subdistrict_code')
        # Create a mapping of village_code to subdistrict_code
        village_mapping = {v['village_code']: v['subdistrict_code'] for v in village_data}
        # Update the villages list with the correct subDistrictId
        for village in villages:
            village_code = village['id']
            if village_code in village_mapping:
                village['subDistrictId'] = village_mapping[village_code]




        main_output={}
        if single_year:
            main_output['Arithmetic']=Arithmetic_population_single_year(base_year,single_year,villages,subdistrict)
            main_output['Geometric']=Geometric_population_single_year(base_year,single_year,villages,subdistrict)
            main_output['Incremental']=Incremental_population_single_year(base_year,single_year,villages,subdistrict)
            main_output['Exponential']=Exponential_population_single_year(base_year,single_year,villages,subdistrict)

        elif start_year and end_year:
            main_output['Arithmetic']=Arithmetic_population_range(base_year,start_year,end_year,villages,subdistrict)  
            main_output['Geometric']=Geometric_population_range(base_year,start_year,end_year,villages,subdistrict)
            main_output['Incremental']=Incremental_population_range(base_year,start_year,end_year,villages,subdistrict)
            main_output['Exponential']=Exponential_population_range(base_year,start_year,end_year,villages,subdistrict)
        else:
            pass
        print("output",main_output)
        return Response(main_output, status=status.HTTP_200_OK)



    