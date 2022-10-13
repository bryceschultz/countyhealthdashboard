import { useState, useEffect } from 'react';
import {
    Block,
    Card,
    ColGrid,
    Toggle, 
    ToggleItem,
    Bold,
    BarList,
    Text,
    Title,
    Flex, 
    Metric, 
    BadgeDelta,
    Button
} from '@tremor/react';
import axios from 'axios';
import CountiesMap from '../MapOfCounties/MapWithTooltip'
import '@tremor/react/dist/esm/tremor.css';

const top_5_deaths = [
    { cause_of_death: '/home', value: 456 },
    { name: '/imprint', value: 351 },
    { name: '/cancellation', value: 271 },
    { name: '/special-offer-august-get', value: 191 },
    { name: '/documentation', value: 91 },
];

export default function KpiCardGrid() {
    const [activeCounty, setActiveCounty] = useState({"name":'All Counties'});
    const [activeYear, setActiveYear] = useState(2011);
    const [topCod2011, setTopCod2011] = useState(null);
    const [topCod2016, setTopCod2016] = useState(null);
    const [initialStateLoading, setInitialStateLoading] = useState(true);
    const [deathCount2011, setDeathCount2011] = useState(null);
    const [deathCount2016, setDeathCount2016] = useState(null);
    const [deathCountDifference, setDeathCountDifference] = useState(null);
    const [fastFoodCount, setFastFoodCount] = useState(null);


    const handleCountyChange = async (county) => {
        setInitialStateLoading(true);
        var deathCount2011;
        var deathCount2016;
        var formdata = new FormData();
        formdata.append("year", "2011");
        formdata.append("fips", county);
        await axios({
            method: "post",
            url: "http://localhost:3001/top_5",
            data: formdata,
            headers: { "Content-Type": "multipart/form-data" },
          })
        .then(function (response) {
            const causeOfDeathList = []
            for (const row of response.data.rows) { 
                causeOfDeathList.push({"name": row.cause_of_death, "value": row.death_counts})
            }
            setTopCod2011(causeOfDeathList);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
        var formdata = new FormData();
        formdata.append("year", "2016");
        formdata.append("fips", county);
        await axios({
            method: "post",
            url: "http://localhost:3001/top_5",
            data: formdata,
            headers: { "Content-Type": "multipart/form-data" },
          })
        .then(function (response) {
            const causeOfDeathList = []
            for (const row of response.data.rows) { 
                causeOfDeathList.push({"name": row.cause_of_death, "value": row.death_counts})
            }
            setTopCod2016(causeOfDeathList);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
        var formdata = new FormData();
        formdata.append("year", "2011");
        formdata.append("fips", county);
        await axios({
            method: "post",
            url: "http://localhost:3001/death_count",
            data: formdata,
            headers: { "Content-Type": "multipart/form-data" },
          })
        .then(function (response) {
            console.log(response.data.rows[0].sum);
            deathCount2011 = response.data.rows[0].sum;
            setDeathCount2011(response.data.rows[0].sum);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
        var formdata = new FormData();
        formdata.append("year", "2016");
        formdata.append("fips", county);
        await axios({
            method: "post",
            url: "http://localhost:3001/death_count",
            data: formdata,
            headers: { "Content-Type": "multipart/form-data" },
          })
        .then(function (response) {
            deathCount2016 = response.data.rows[0].sum;
            setDeathCount2016(response.data.rows[0].sum);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
        var formdata = new FormData();
        formdata.append("fips", county);
        await axios({
            method: "post",
            url: "http://localhost:3001/ff_count",
            data: formdata,
            headers: { "Content-Type": "multipart/form-data" },
          })
        .then(function (response) {
            const sr2011 = parseInt(response.data.rows[0].sumrest2011)
            const sr2016 = parseInt(response.data.rows[0].sumrest2016)
            const difference = sr2016 - sr2011
            response.data.rows[0].difference = (difference / sr2011) * 100
            console.log(response.data.rows[0]);
            setFastFoodCount(response.data.rows[0]);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });

        const difference = deathCount2016 - deathCount2011;
        const perChange = (difference / deathCount2011) * 100
        setDeathCountDifference(perChange);
        setInitialStateLoading(false);   
        setInitialStateLoading(false);   
    };

    const loadInitialState = async () => {
        var deathCount2011;
        var deathCount2016;
        var formdata = new FormData();
        formdata.append("year", "2011");
        await axios({
            method: "post",
            url: "http://localhost:3001/top_5_all_counties",
            data: formdata,
            headers: { "Content-Type": "multipart/form-data" },
          })
        .then(function (response) {
            const causeOfDeathList = []
            for (const row of response.data.rows) { 
                causeOfDeathList.push({"name": row.cause_of_death, "value": row.death_counts})
            }
            setTopCod2011(causeOfDeathList);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
        var formdata = new FormData();
        formdata.append("year", "2016");
        await axios({
            method: "post",
            url: "http://localhost:3001/top_5_all_counties",
            data: formdata,
            headers: { "Content-Type": "multipart/form-data" },
          })
        .then(function (response) {
            const causeOfDeathList = []
            for (const row of response.data.rows) { 
                causeOfDeathList.push({"name": row.cause_of_death, "value": row.death_counts})
            }
            setTopCod2016(causeOfDeathList);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
        var formdata = new FormData();
        formdata.append("year", "2011");
        await axios({
            method: "post",
            url: "http://localhost:3001/death_count_all_counties",
            data: formdata,
            headers: { "Content-Type": "multipart/form-data" },
          })
        .then(function (response) {
            deathCount2011 = response.data.rows[0].sum;
            setDeathCount2011(response.data.rows[0].sum);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
        var formdata = new FormData();
        formdata.append("year", "2016");
        await axios({
            method: "post",
            url: "http://localhost:3001/death_count_all_counties",
            data: formdata,
            headers: { "Content-Type": "multipart/form-data" },
          })
        .then(function (response) {
            console.log('death count 2016')
            deathCount2016 = response.data.rows[0].sum;
            setDeathCount2016(response.data.rows[0].sum);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
        await axios.get("http://localhost:3001/ff_count_all_counties")
        .then(function (response) {
            const sr2011 = parseInt(response.data.rows[0].sumrest2011)
            const sr2016 = parseInt(response.data.rows[0].sumrest2016)
            const difference = sr2016 - sr2011
            response.data.rows[0].difference = (difference / sr2011) * 100
            console.log(response.data.rows[0]);
            setFastFoodCount(response.data.rows[0]);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
        const difference = deathCount2016 - deathCount2011;
        const perChange = (difference / deathCount2011) * 100
        setDeathCountDifference(perChange);
        setInitialStateLoading(false);   
    };


    useEffect(() => {
        loadInitialState();
      }, []);
    

    return (
        <main className="bg-slate-50 p-6" style={{margin:"150px"}}>
            <Title>American Health by County</Title>
            <Text>
                This dashboard represents the change from 2011-2016 for each county in the U.S.
            </Text>
            { initialStateLoading &&
<>
<div style={{textAlign:"center", margin:"30px"}}>
<Toggle defaultValue={2011} handleSelect={(value) => setActiveYear(value)}>
<ToggleItem value={2011} text="2011" />
<ToggleItem value={2016} text="2016"/>
</Toggle>
</div>
        <ColGrid numColsMd={ 2 } numColsLg={ 4 } gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
        <Card>
            <div className="h-28">
                <Flex className="h-28">
                <Text>
                    County(s) Selected</Text>
                </Flex>
                <Metric>{activeCounty.name}</Metric>
                </div>
            </Card>
        <Card>
            <div className="h-28">
                <Flex className="h-28">
                <Text>
                    Year Selected</Text>
                </Flex>
                <Metric>{activeYear}</Metric>
                </div>
            </Card>
        <Card>
            <div className="h-28">
                <Flex className="h-28">
                <Text>Number of Deaths</Text>
                </Flex>
                { activeYear == 2011 &&
                <div style={{textAlign:"center", margin:"30px"}}>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
                }
                { activeYear == 2016 &&
                <div style={{textAlign:"center", margin:"30px"}}>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
                }
                </div>
            </Card>
            <Card>
            <div className="h-28">
                <Flex className="h-28">
                <Text>Fast Food Restaurants</Text>
                </Flex>
                { activeYear == 2011 && 
                <div style={{textAlign:"center", margin:"30px"}}>
                    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
                }
                { activeYear == 2016 && 
                <div style={{textAlign:"center", margin:"30px"}}>
                    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
                }
                </div>
            </Card>
           

        </ColGrid>
        <Block marginTop="mt-6">
        <Card>
        
                <div className="h-28" >
                    <Text>Top 5 Causes of Death</Text>
                    <Flex
                    justifyContent="justify-between"
                    marginTop="mt-4"
                    >
                    <Text><Bold>Cause</Bold></Text>
                    <Text><Bold>Count</Bold></Text>
                    </Flex>
                    <div style={{textAlign:"center", margin:"30px"}}>
                    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                    </div>
                </div> 
        
            </Card>
        </Block>
        </>
            }
            { !initialStateLoading &&
            <>
            <div style={{textAlign:"center", margin:"30px"}}>
            <Toggle defaultValue={2011} handleSelect={(value) => setActiveYear(value)}>
            <ToggleItem value={2011} text="2011" />
            <ToggleItem value={2016} text="2016"/>
            </Toggle>
            </div>
                    <ColGrid numColsMd={ 2 } numColsLg={ 4 } gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
                    <Card>
                        <div className="h-28">
                            <Flex className="h-28">
                            <Text>
                                County(s) Selected</Text>
                            </Flex>
                            <Metric>{activeCounty.name}</Metric>
                            </div>
                        </Card>
                    <Card>
                        <div className="h-28">
                            <Flex className="h-28">
                            <Text>
                                Year Selected</Text>
                            </Flex>
                            <Metric>{activeYear}</Metric>
                            </div>
                        </Card>
                    <Card>
                        <div className="h-28">
                            <Flex className="h-28">
                            <Text>Number of Deaths</Text>
                            { activeYear == 2016 && deathCountDifference < 0 &&
                            <BadgeDelta
                                deltaType="moderateDecrease"
                                text={(Math.round(deathCountDifference * 100) / 100) + "%"}
                                isIncreasePositive={true}
                                size="xs"
                            />
                            }
                            { activeYear == 2016 && deathCountDifference > 0 &&
                            <BadgeDelta
                                deltaType="moderateIncrease"
                                text={(Math.round(deathCountDifference * 100) / 100) + "%"}
                                isIncreasePositive={true}
                                size="xs"
                            />
                            }
                            </Flex>
                            { activeYear == 2011 &&
                            <Metric>{deathCount2011}</Metric>
                            }
                            { activeYear == 2016 &&
                            <Metric>{deathCount2016}</Metric>
                            }
                            </div>
                        </Card>
                        <Card>
                        <div className="h-28">
                            <Flex className="h-28">
                            <Text>Fast Food Restaurants</Text>
                            { activeYear == 2016 && fastFoodCount.difference > 0 &&
                            <BadgeDelta
                                deltaType="moderateIncrease"
                                text={(Math.round(fastFoodCount.difference * 100) / 100) + "%"}
                                isIncreasePositive={true}
                                size="xs"
                            />
                            }
                            { activeYear == 2016 && fastFoodCount.difference < 0 &&
                            <BadgeDelta
                                deltaType="moderateDecrease"
                                text={(Math.round(fastFoodCount.difference * 100) / 100) + "%"}
                                isIncreasePositive={true}
                                size="xs"
                            />
                            }
                            </Flex>
                            { activeYear == 2011 && 
                                <Metric>{fastFoodCount.sumrest2011}</Metric>
                            }
                            { activeYear == 2016 && 
                                <Metric>{fastFoodCount.sumrest2016}</Metric>
                            }
                            </div>
                        </Card>
                       

                    </ColGrid>
                    <Block marginTop="mt-6">
                    <Card>
                    
                            <div className="h-28" >
                                <Text>Top 5 Causes of Death</Text>
                                <Flex
                                justifyContent="justify-between"
                                marginTop="mt-4"
                                >
                                <Text><Bold>Cause</Bold></Text>
                                <Text><Bold>Count</Bold></Text>
                                </Flex>
                                { activeYear == 2011 &&
                                    <BarList data={ topCod2011 } marginTop="mt-2" />
                                }
                                { activeYear == 2016 &&
                                    <BarList data={ topCod2016 } marginTop="mt-2" />
                                }
                            </div> 
                    
                        </Card>
                    </Block>
                    </>
                }
                    <Block marginTop="mt-6">
                        <Card>
                        <Text>
                            Click on a county to filter the dashboard
                        </Text>
                            <CountiesMap setActiveCounty={setActiveCounty} activeCounty={activeCounty} handleCountyChange={handleCountyChange}/>
                        </Card>
                    </Block>
        </main>
    );
}