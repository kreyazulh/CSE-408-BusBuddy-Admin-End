#include<bits/stdc++.h>
using namespace std;
typedef long long int ll;

int main(){
    ifstream in("sth.txt");
    ofstream out("psql.sql");
    string stop, lat, lon;
    while(in>> stop>> lat>> lon){
        /*
        UPDATE station
        SET coord = POINT(23.1, 90.6)
        WHERE name = 'manzil';
        */
        for(ll i=0; i<stop.size(); i++) if(stop[i]=='_') stop[i] = ' ';
        out<< "UPDATE station SET coords = POINT("<< lat<< ","<< lon<< ") WHERE name = "<< stop<< ";\n";
    }
    in.close();
    out.close();
}