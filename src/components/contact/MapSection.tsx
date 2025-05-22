
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const MapSection = () => {
  return (
    <div className="space-y-4">
      <Card className="shadow-md">
        <CardContent className="p-6 flex items-start">
          <MapPin className="h-6 w-6 text-brand-purple mr-4 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg mb-2">Our Campus</h3>
            <p className="text-gray-700">Shri Shankaracharya Group of Institution</p>
            <p className="text-gray-700">Junwani, Bhilai</p>
            <p className="text-gray-700">Chhattisgarh 490020</p>
            <p className="text-gray-500 text-sm mt-2">Visit us Monday-Friday, 9am-5pm</p>
          </div>
        </CardContent>
      </Card>

      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
        <iframe 
          title="Campus Location" 
          className="w-full h-full" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src="https://maps.google.com/maps?width=100%&height=400&hl=en&q=Shri%20Shankaracharya%20Group%20of%20Institution,%20Junwani,%20Chhattisgarh%20490020%20bhilai+(location)&t=h&z=13&ie=UTF8&iwloc=B&output=embed" 
        />
      </div>
    </div>
  );
};

export default MapSection;
