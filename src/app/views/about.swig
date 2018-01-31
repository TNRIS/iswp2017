{% set current_page = 'about' %}
{% extends 'layout/layout.swig' %}

{% block title %}
  <title>About | 2017 Texas State Water Plan</title>
{% endblock title %}

{% block content %}
  <section class="content">
    <div class="container">
      <div class="row panel-row">
        <div class="twelve columns">
          <h2>About</h2>
          <section id="Contents">
            <ol>
              <li><a href="#WhatIsThis">What is this site and what does it do?</a></li>
              <li><a href="#HowDoIFindData">How do I find the information I'm looking for?</a></li>
              <li><a href="#HowDoIUseTheMap">How do I use the interactive map?</a></li>
              <li><a href="#StateWaterPlanData">State Water Plan Data</a></li>
              <li><a href="#HowProjectsLocated">How are the locations of the projects determined?</a></li>
              <li><a href="#Glossary">Glossary</a></li>
              <li><a href="#DownloadingData">Downloading Data</a></li>
              <li><a href="#PreviousPlans">Previous Plans</a></li>
              <li><a href="#AboutUs">About Us</a></li>
              <li><a href="#SitePolicies">Site Policies</a></li>
              <li><a href="#Credits">Credits</a></li>
            </ol>
          </section>
          <section id="WhatIsThis">
            <h3>What is this site and what does it do?</h3>
            <p><a href="#Top"><small>Back to Top</small></a></p>

            <p>
              This website is an integral part of the 2017 State Water Plan that lets water users statewide take an up-close look at data in the 2017 State Water Plan and how water needs change over time. The user-friendly website, which is also easily viewed on most mobile devices, now shows:
            </p>

            <ul>
              <li>projected water demands,</li>
              <li>existing water supplies,</li>
              <li>the relative severity and projected water needs (potential shortages),</li>
              <li>the water management strategies recommended to address potential shortages, and</li>
              <li>recommended capital projects and their sponsors.</li>
            </ul>

            <p>
              over the next 50 years in geographical and tabular forms. Note that all county-based water user group categories are mapped to the same location at the center of each county.
            </p>
          </section>

          <section id="HowDoIFindData">
            <h3>How do I find the information I'm looking for?</h3>
            <p><a href="#Top"><small>Back to Top</small></a></p>

            <p>
              A good place to start is the <strong>‘View data for’</strong> drop down menu found in the upper left of the home page. From this drop down you can navigate to pages with state water plan data organized by a specific area of interest or data type.
            </p>

            <img src="/public/static/img/HowDoIFindData.png" width="80%" style="padding:10px;">

            <p>
            Once you’ve navigated to a specific page you can start exploring the data related to that topic/area. Each page will contain demand, existing supply, need (potential shortage), and strategy supply data related to that page topic. The data are presented in a variety of formats such as graphs, figures, tables, and maps. Many of the page elements are interactive so you can hover over and click elements to show more detail, use embedded search and sort functions to locate information, or click hyperlinks to navigate to other pages in the application.
            If you are interested in digging deeper and interacting more with the data on a page, scroll down to the <strong>‘Raw Data’</strong> section. In addition to reflecting the decade and theme button selections in the banner above the map, the data displayed in this section can be filtered and sorted using the drop-down boxes below the <strong>‘Raw Data’</strong> section heading. The column toggles allow you to control the aggregation levels of the data.
            </p>

            <ul>
              <li>To change an existing column, update that selected drop-down to another item in the list</li>
              <li>To remove an existing column, update that selected drop-down to the blank entry in the list</li>
              <li>To add a new column, select it from the <strong>‘Sub Dimension…’</strong> drop down list</li>
            </ul>

            <img src="/public/static/img/HowDoIFindData2.png" width="90%" style="padding:10px;">

            <p>
              Additionally, you can filter by specific data within the table using the 'solo' feature. To do this, hover the mouse over the data element you wish to filter by until a 'solo' button appears. Selecting this feature will filter all the data in the table based on your selection. Multiple filters may be added using the same method, and all applied filters will be listed in the area above the column headers. To remove a solo filter, simply click the 'X' button to the left of the item listed in the area above the column headers.
            </p>

            <img src="/public/static/img/HowDoIFindData3.png" width="90%" style="padding:10px;">

          </section>

          <section id="HowDoIUseTheMap">
            <h3>How do I use the interactive map?</h3>
            <p><a href="#Top"><small>Back to Top</small></a></p>

            <p>
              Interactive maps are included to view and explore the state water plan data geographically. Here are some tools that will help you navigate and use the maps:
            </p>
            <ul>
              <li><strong>Pan –</strong> To move the map; click and hold the left mouse button and drag the map to a new place.</li>
              <li><strong>Zoom –</strong> To see more details or a larger area on the map you can zoom in and out using the +/- sign buttons in the top right. Double left clicking your mouse on a map area will also zoom you into that location.</li>
              <li><strong>Statewide View –</strong> To quickly view all of Texas click on the button in the upper right with the Texas graphic.</li>
              <li><strong>Lock Extent –</strong> To freeze the map at a specific location and zoom level click the lock button on the right side of the screen. The button will darken when turned on and lock the map extent as you click through the different theme and decade buttons. This function may be turned off by clicking the lock button a second time.</li>
              <li><strong>Map Information –</strong> Symbol descriptions, notes, and disclaimers may appear just below the map panel to provide more information about what is being displayed.</li>
              <li><strong>Hover Labels –</strong> Some map items will display labels when you hover your mouse over them. Clicking on any of these items will navigate you away from the current page to a page related to that item in the interactive state water plan.</li>
              <li><strong>Decade Buttons –</strong> These are in the banner above the map and filter the map data by decade. For example, Project symbols will begin displaying on the map in the decade that matches the project’s online decade and continue to show in all subsequent decades.</li>
              <li><strong>Theme Buttons –</strong> These are in the banner above the map and filter the map data by type.</li>
              <li><strong>Symbol Popups –</strong> You can click on individual symbols to open a popup displaying data associated with that item. If there are overlapping symbols clicking on the cluster will cause them to spread out and allow you to select each one individually.</li>
            </ul>

            <img src="/public/static/img/HowDoIUseTheMap.png" width="90%" style="padding:10px;">

            <p>
              Due to the nature of the state water plan data not everything is relevant to display on the map. Please keep the following in mind when exploring the interactive maps:
            </p>
            <ul>
              <li>The map for a selected region page will only display projects that benefit water user group splits within that planning region.</li>
              <li>Sources will only display in the map if at least one water user group has an existing supply or water management strategy supply amount greater than zero tied to it in the selected decade.</li>
              <li>Only the following sources are mapped: groundwater, indirect reuse, reservoir, system, run-of-river, and seawater.</li>
              <li>If an unmapped source type (EX: Direct Reuse) has related WMS WUG supplies or a project with capital costs, it will be represented on the map by the location of the project and/or benefiting WUG.</li>
              <li>If a water user group is related to a zero value for a specific theme and decade it will not display on the map, except for WUGs with zero associated population on the project page. For example, the needs map theme will not display a WUG point if they have zero needs in the selected decade.</li>
              <li>Information about recommended WMS projects that are not specifically associated with water user groups are displayed on the WMS Project application page although, because the water supply is not assigned to water user groups, neither the WMS project or associated supply will display on any of the other application pages until that strategy supply has been assigned to a water user group. These types of projects are recommended by the region to develop supply where a benefiting water user group has not yet been identified.</li>
            </ul>

          </section>

          <section id="StateWaterPlanData">
            <h3>State Water Plan Data</h3>
            <p><a href="#Top"><small>Back to Top</small></a></p>

            <p>
              Development of the state water plan is central to the mission of the TWDB.  Based on 16 regional water plans, the plan addresses the needs of all water user groups in the state &ndash; municipal, irrigation, manufacturing, livestock, mining, and steam-electric power &ndash; during a repeat of the drought of record that the state suffered in the 1950s. The regional and state water plans consider a 50-year planning horizon: 2020 through 2070.
            </p>

            <p>During each five-year planning cycle, planning groups evaluate:</p>
            <ul>
              <li>population projections,</li>
              <li>water demand projections, and</li>
              <li>existing water supplies that would be available during times of drought.</li>
            </ul>

            <p>Planning groups identify:</p>
            <ul>
              <li>water user groups that will not have enough water during times of drought, and</li>
              <li>recommend strategies and projects that could be implemented to address shortages.</li>
            </ul>

            <p>
              At the end of each five-year regional water planning cycle, agency staff compiles information from the approved <a href="http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/index.asp" title="Regional Water Plans">regional water plans</a> and other sources to develop the state water plan, which is presented to TWDB's governing Board for adoption. The final adopted plan is then submitted to the Governor, Lieutenant Governor, and the Texas Legislature.
            </p>

            <p>
              The <a href="http://www.twdb.texas.gov/waterplanning/swp/2017/index.asp" title="2017 State Water Plan">2017 State Water Plan</a> is the tenth state water plan and the fourth plan based on the regional water planning process. In addition to incorporating the regional water plans, the state water plan serves as a guide to state water policy.
            </p>
          </section>

          <section id="HowProjectsLocated">
            <h3>How are the locations of the projects determined?</h3>
            <p><a href="#Top"><small>Back to Top</small></a></p>

            <p>
              Water “projects” are the future capital investments in infrastructure that support water management strategies. Capital project symbols (red triangles) are mapped to a single point as a necessary simplification to represent a geographic location of each water project (e.g., well fields, reservoirs, pipelines) solely for the purposes of representing the water plan visually. The basis for selecting each representative location varied depending on the regional water plan and particular type of infrastructure but, in general, the default project locations relate to:
            </p>

            <ul>
              <li>approximate locations of at least one component of major infrastructure such as dams, water treatment plants, water intakes for pipelines, or well fields proposed in the plan; or</li>
              <li>the primary location of the water user group in which certain types of infrastructure would be located, such as some water treatment plants within a city or water conservation investments; or</li>
              <li>the centroid of the county in which a project with dispersed infrastructure would be located, such as county-wide irrigation, mining, or manufacturing conservation projects; or</li>
              <li>the centroid of a county-aquifer polygon for certain, generalized groundwater supply projects.</li>
            </ul>

            <p>
              The actual locations and physical extent of recommended projects will vary and, in many instances such as pipelines, will encompass multiple geographic locations and facilities.
            </p>
          </section>

          <section id="Glossary" class="glossary">
            <h3>Glossary</h3>
            <p><a href="#Top"><small>Back to Top</small></a></p>

            <p>
              For these and other terms, see also the 2017 State Water Plan
              <a title="Glossary" href="http://www.twdb.texas.gov/waterplanning/swp/2017/chapters/10-SWP17-GLOSSARY-APPENDICES.pdf?d=3717.1800000000003">glossary</a>.
            </p>

            <h5 id="acre-foot">ACRE-FOOT</h5>
            <p>
              Volume of water needed to cover 1 acre to a depth of 1 foot. It equals 325,851 gallons.
            </p>

            <h5 id="county-other">COUNTY-OTHER</h5>
            <p>
              An aggregation of residential, commercial, and institutional water users in cities with less than 500 people or utilities that provide less than an average of 250,000 gallons per day, as well as unincorporated rural areas in a given county.
            </p>

            <h5 id="drought">DROUGHT</h5>
            <p>
              Term is generally applied to periods of less than average precipitation over a certain period of time. Associated definitions include meteorological drought (abnormally dry weather), agricultural drought (adverse impact on crop or range production), and hydrologic drought (below average water content in aquifers and/or reservoirs).
            </p>

            <h5 id="drought-of-record">DROUGHT OF RECORD</h5>
            <p>
              Period of time during recorded history when natural hydrological conditions provided the least amount of water supply. For Texas as a whole, the drought of record is generally considered to be from about 1950 to 1957.
            </p>

            <h5 id="existing-water-supply">EXISTING WATER SUPPLY</h5>
            <p>
              Maximum amount of water available from existing sources for use during drought of record conditions that is physically and legally available for use.
            </p>

            <h5 id="needs">NEEDS</h5>
            <p>
              Projected water demands in excess of existing water supplies for a water user group or a wholesale water provider. (i.e., potential shortage if no water management strategy is recommended).
            </p>

            <h5 id="water-management-strategy">RECOMMENDED WATER MANAGEMENT STRATEGY</h5>
            <p>
              Specific project or action to increase water supply or maximize existing supply to meet a specific need.
            </p>

            <h5 id="unmet-needs">UNMET NEEDS</h5>
            <p>
              Portion of the demand for water that exceeds water supply after inclusion of all recommended water management strategies in a regional water plan.
            </p>

            <h5 id="water-demand">WATER DEMAND</h5>
            <p>
              Quantity of water projected to meet the overall necessities of a water user group in a specific future year.
            </p>

            <h5 id="water-user-group">WATER USER GROUP</h5>
            <p>
              Identified user or group of users for which water demands and water supplies have been identified and analyzed and plans developed to meet water needs. Water user groups are defined at the county level for the manufacturing, irrigation, livestock, steam-electric power generation, and mining water use categories. Municipal water user groups include (a) incorporated cities and selected Census Designated Places with a population of 500 or more; (b) individual or groups of selected water utilities serving smaller municipalities or unincorporated areas; and (c) rural areas not included in a listed city or utility, aggregated for each county.
            </p>
          </section>

          <section id="DownloadingData">
            <h3>Downloading Data</h3>
            <p><a href="#Top"><small>Back to Top</small></a></p>

            <p>Data is available for you to download as Comma-Separated Value (.csv) files through links at the bottom of each application page. Downloads of statewide datasets are available at the bottom of the application homepage, and all water volumes are in units of acre-feet/year.</p>

            <p>
              For any questions regarding the data or how to apply it, please contact: <a href="mailto:WRPdatarequests@twdb.texas.gov" title="">WRPdatarequests@twdb.texas.gov</a>
            </p>

            <h4 id="API">API</h4>
            <p>
              Data may be programmatically accessed using the Interactive 2017 State Water Plan API. See the <a href="/api/v1" title="API documentation">API documentation page</a> for a description of API methods.
            </p>
          </section>

          <section id="PreviousPlans">
            <h3>Previous Plans</h3>
            <p>
              Looking for the 2012 Interactive State Water Plan website? View it at <a title="2012 Interactive State Water Plan" href="http://2012.texasstatewaterplan.org">http://2012.texasstatewaterplan.org</a>.
            </p>
            <p>
              For past State Water Plans, please visit <a title="TWDB State Water Planning" href="http://www.twdb.texas.gov/waterplanning/index.asp">http://www.twdb.texas.gov/waterplanning/index.asp</a>.
            </p>
          </section>

          <section id="AboutUs">
            <h3>About Us</h3>
            <p><a href="#Top"><small>Back to Top</small></a></p>
            <p>
              This website is a product of the Texas Water Development Board (TWDB). This project is part of our ongoing efforts to communicate information from the 2017 State Water Plan to planners, scientists, policy makers, and the public.
            </p>
            <p>
              TWDB is charged by the Texas Legislature with administering the regional water planning process and developing a state water plan every five years. The data presented are the result of that process and are based on the expertise of numerous people and organizations throughout the state of Texas who participated in development of the 2016 Regional Water Plans, including the more than 450 regional water planning group members, consultants, and administrative agencies; staff of the TWDB; Texas Parks and Wildlife Department, Texas Department of Agriculture, and Texas Commission on Environmental Quality; and the individuals and organizations that provided public input throughout the planning process.
            </p>

            <h4>How Do We Plan?</h4>
            <p>
              Water planning in Texas starts at the regional level with 16 regional water planning groups, one for each of the 16 designated planning areas in the state. Each planning group consists of about 25 members who represent at least 12 interests, as required by Texas statute, including agriculture, industry, public, environment, municipalities, business, water districts, river authorities, water utilities, counties, power generation, and groundwater management areas.
            </p>
            <p>
              During each five-year planning cycle, planning groups evaluate population projections, water demand projections, and existing water supplies that would already be available during times of drought for 2,600 water user groups. Planning groups identify water user groups that will not have enough water during times of drought, recommend strategies that could be implemented to address shortages, and estimate the costs of these strategies. While carrying out these tasks, planning groups assess risks and uncertainties in the planning process and evaluate potential impacts of water management strategies on the state's water, agricultural, and natural resources.
            </p>
            <p>
              Once the planning groups adopt their regional water plans, they are submitted to the TWDB &mdash; the state's water supply planning and financing agency &mdash; for approval. TWDB then compiles the state water plan, which serves as a guide to state water policy, with information from the regional water plans and policy recommendations to the Texas Legislature. Each step of the process is open to the public and provides numerous opportunities for public input.
            </p>

            <h4>Data Sources</h4>
            <p>
              All data presented are based on the sixteen <a href="http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/index.asp" title="2016 Regional Water Plans">2016 Regional Water Plans</a> and the <a href="http://www.twdb.texas.gov/waterplanning/swp/2017/index.asp" title="2017 State Water Plan">2017 State Water Plan</a>. The water planning data are based on the Regional Water Planning Data Application used to collect data directly from the regional water planning groups.
            </p>
            <p>
              Statewide summaries of the data presented were published in the <a href="http://www.twdb.texas.gov/waterplanning/swp/2017/" title="2017 State Water Plan">2017 State Water Plan</a>.
            </p>
          </section>

          <section id="SitePolicies">
            <h3>Site Policies</h3>
            <p><a href="#Top"><small>Back to Top</small></a></p>
            <p>
              This website is an official TWDB ancillary website operated for authorized use only and provided as a public service. This policy describes the TWDB's privacy and security practices regarding information collected from visitors to the website, including what information is collected and how that information is used. Regardless of the information being transmitted to the TWDB, we will protect all such information consistent with applicable law. The privacy of our customers and the security of this website are of utmost importance to the TWDB.
            </p>

            <h4>Privacy Policy</h4>
            <p>
              The TWDB analyzes server logs for statistical purposes only and makes no attempt to personally identify website visitors. The TWDB does not collect any personally identifiable information, such as names, addresses, phone numbers or e-mail addresses, unless you choose to provide such information. Statistics such as time, date, or pages requested are used for accessing the information of most interest to users and identifying system performance or problem areas. This information is also gathered for anonymous File Transfer Protocol (ftp), remote account login, or for other comparable connections. Information that may be collected at this website through questionnaires, feedback forms, or other means, enables the TWDB to determine a visitor's interests, with the goal of providing better customer service.
            </p>
            <p>
              All information collected, including server log information and information submitted on electronic forms, is subject to disclosure to others upon request according to the requirements of the Public Information Act (codified at Texas Government  Code, Section 552.011, Vernon's 2000) and the State Government Privacy Policies Act (codified at Texas Government Code, Section 559, Vernon's 2001). Information collected by electronic mail and by web forms may be subject to the Public Information Act; however, email addresses of those who correspond with the TWDB are confidential and may not be disclosed unless the sender agrees to such. Exceptions to confidentiality may be reviewed at Texas Government code, Section 552.137.
            </p>
            <p>
              By sending the TWDB an electronic mail message or submitting a web-based form, you may be sending the agency personally identifying information, such as name and address. In these cases, the TWDB may retain the information as long as necessary to respond to your request or otherwise resolve the subject matter of your e-mail. The TWDB may redirect your message to another government agency or person who is in a better position to answer your question as necessary. Please be aware that e-mails and web-based forms are not necessarily secure from third-party interception or misdirection. For your own protection, you may wish to communicate sensitive information using another method.
            </p>

            <h4>Review of Personal Information</h4>
            <p>
              An individual who submits information in electronic format through this website is entitled, on request, to receive and review the information that the TWDB collects about the individual, and to have TWDB correct the information. To make a request, please contact the following person:
            </p>
            <p class="indent">
              Public Information Officer<br/>
              Telephone: <a href="tel:+15124638165">(512) 463-8165</a><br/>
              Info Desk: <a href="tel:+15124637847">(512) 463-7847</a><br/>
              E-mail: <a href="mailto:publicinfo@twdb.texas.gov">publicinfo@twdb.texas.gov</a>
            </p>

            <h4>Security</h4>
            <p>
              For website security purposes and to ensure that this service remains available to all users, the TWDB employs monitors and filters to identify and block unauthorized attempts to upload or change information, or otherwise cause damage to the information on this website. Unauthorized access, modification, or destruction of this website are strictly prohibited and may be punishable under the Texas Penal Code Chapters 33 (Computer Crimes) or 33A (Telecommunications Crimes).
            </p>

            <h4>Website Link Policy</h4>
            <p>
              This website provides links to other websites, both public and private, for informational purposes. This policy does not apply whenever visitors leave the Interactive 2017 Texas State Water Plan website and follow a link to another website, including the websites of other state agencies and local governments.  Links to other websites from this website are provided solely as a courtesy. The TWDB has no control over the posting of material to such websites and cannot take responsibility for the validity of the content. The TWDB endeavors to follow the <a href="http://www.dir.texas.gov/pubs/retired/Pages/srrpub11-agencylink.aspx" title="State Website Link and Privacy Policy">State Website Link and Privacy Policy</a>, which addresses linking to and from state agency websites. TWDB encourages organizations that link to this website to comply with the provisions of the <a href="http://www.dir.texas.gov/pubs/retired/Pages/srrpub11-agencylink.aspx" title="State Website Link and Privacy Policy">State Website Link and Privacy Policy</a>, especially regarding protection of the privacy rights of individuals, and to make reasonable efforts to provide accessible websites.
            </p>

            <h4>Cookies</h4>
            <p>
              A cookie is a small text file that resides on the user's hard drive, created at the request of the web server to track specific information.  The Interactive 2017 Texas State Water Plan Website will use cookies to create session information to facilitate your use of the site. The information contained in these cookies is randomly created information and contain no personally identifiable information, so your anonymity is preserved. These cookies are not stored or tracked after the session ends.
            </p>

            <h4>Disclaimer</h4>
            <p>
              With respect to documents or information available from this website, or documents or information from other servers made available through  this website, neither the TWDB nor any of their employees, nor any of their contractors, subcontractors, or their employees, makes any warranty, express or implied, including the warranties of merchantability and fitness for a particular  purpose, or assumes any legal liability or responsibility for the accuracy, completeness, or usefulness of any information, apparatus, product, or process disclosed, or represents that its use would not infringe privately owned rights.
            </p>
            <p>
              TWDB makes no effort to independently verify, and does not exert editorial  control over, information on pages outside of the Interactive 2017 Texas State Water Plan website. TWDB advises website visitors to read the privacy policies of any third-party websites accessed through this website. TWDB does not endorse any of the products, vendors, consultants, or documentation referenced in this website. Any mention of vendors, products, or services is for informational purposes only.
            </p>

            <h4>Copyright Policy</h4>
            <p>
              The TWDB freely grants permission to copy and distribute its materials. The agency would appreciate acknowledgment.
            </p>

            <h4>Accessibility Policy</h4>
            <p><i>Due to current technology constraints, there are some instances where the TWDB is unable to provide information in an accessible format (e.g. mapping information).</i></p>
            <h5>Policy Intention</h5>
            <p>The intention of this policy is to state clear accessibility principles that all Texas Water Development Board (TWDB) websites must follow.</p>

            <p>The TWDB strives to ensure all of its websites comply with the <a href="http://www.w3.org/TR/WCAG20/">Web Content Accessibility Guidelines</a> (WCAG) when possible without causing undue burden to the agency.&nbsp; The TWDB will be monitoring these sections and will develop accessible solutions as technology improves.&nbsp; In order to ensure no user is disadvantaged, the TWDB will respond to all accessibility assistance requests by either altering the necessary content as soon as possible or, if requested, by providing the information in an alternative format at no cost to the user within a reasonable timeframe.&nbsp; It is the responsibility of the webpage owner to provide these alternative formats.&nbsp; The TWDB websites will provide appropriate channels of communication that allow visitors to request alternative formats and to give feedback about any accessibility problems.</p>

            <h5>Policy Dimensions</h5>
            <p>For the purpose of this policy, the term "websites" includes:</p>
            <ul>
              <li>All websites (public and non-authenticated) managed and maintained by TWDB staff or on the behalf of TWDB, including, all external websites using the .twdb.texas.gov domain, agency ancillary sites, and social media sites.</li>
              <li>All material associated with pages of the website such as documents, audio, video and any other additional files except for maps.</li>
            </ul>

            <h5>To Get Information in a Different Format</h5>
            <p>If you use assistive technology and the format of any material on our website interferes with your ability to access information, please send an e-mail to the TWDB <a href="mailto:ac@twdb.texas.gov">Accessibility Coordinator</a>.</p>

            <p>When you contact us, please be sure to tell us each of these points:</p>
            <ul>
              <li>the nature of your accessibility problem</li>
              <li>the format in which you prefer to receive the material</li>
              <li>the web address of the requested material</li>
              <li>how we can contact you</li>
            </ul>

            <p>With this information, we will be able to respond in the most helpful way possible.</p>

          </section>

          <section id="Credits">
            <h3>Credits</h3>
            <p><a href="#Top"><small>Back to Top</small></a></p>
            <ul>
              <li>
                <a href="https://thenounproject.com/search/?q=factory&i=11499" title="Factory icon">Factory icon</a> by <a href="https://thenounproject.com/jeremy.j.bristol/" title="Jeremy J Bristol">Jeremy J Bristol</a> (<a href="http://creativecommons.org/licenses/by/3.0/us/" title="CC BY">CC BY</a>) from the <a href="https://thenounproject.com/" title="Noun Project">Noun Project</a>.
              </li>
              <li>
                All other icons are public domain and can be found at the <a href="https://thenounproject.com/" title="Noun Project">Noun Project</a>.
              </li>
              <li>
                <a href="https://www.toptal.com/designers/subtlepatterns/seamless-paper-texture/" title="Seamless Paper Texture">Seamless Paper Texture</a> by Merry (<a href="http://creativecommons.org/licenses/by-sa/3.0/" title="CC BY-SA">CC BY-SA</a>).
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </section>
{% endblock content %}
