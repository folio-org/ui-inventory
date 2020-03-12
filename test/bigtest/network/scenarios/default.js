/* istanbul ignore file */

export default function defaultScenario(server) {
  server.create('instance-type', {
    name: 'still image',
    code: 'sti',
    source: 'rdacarrier'
  });
  server.create('instance-type', {
    name: 'computer dataset',
    code: 'cod',
    source: 'rdacarrier'
  });
  const TACTILE_TEXT = server.create('instance-type', {
    name: 'tactile text',
    code: 'tct',
    source: 'rdacarrier'
  });

  server.create('instance-format', {
    name: 'audio -- audio disc',
    code: 'sd',
    source: 'rdacarrier'
  });
  server.create('instance-format', {
    name: 'audio -- audiocassette',
    code: 'ss',
    source: 'rdacarrier'
  });
  server.create('instance-format', {
    name: 'computer -- online resource',
    code: 'cr',
    source: 'rdacarrier'
  });

  server.create('identifier-type', { name: 'ISSN' });
  server.create('identifier-type', { name: 'ISBN' });

  server.create('instance-relationship-type', { name: 'bound-with' });
  server.create('instance-relationship-type', { name: 'series' });
  server.create('instance-status', {
    name: 'Catalogued',
    code: 'cat',
    source: 'folio'
  });

  server.create('instance-status', {
    name: 'Uncatalogued',
    code: 'uncat',
    source: 'folio'
  });

  // identifier types
  server.create('identifier-type', { name: 'issn' });
  server.create('identifier-type', { name: 'isbn' });
  server.create('identifier-type', { name: 'lccn' });
  const YBP = server.create('identifier-type', { name: 'ybp' });

  // contributor-types
  server.create('contributor-type', {
    name: 'Annotator',
    code: 'ann',
    source: 'marcrelator'
  });
  server.create('contributor-type', {
    name: 'Artist',
    code: 'art',
    source: 'marcrelator'
  });
  server.create('contributor-type', {
    name: 'Author',
    code: 'aut',
    source: 'marcrelator'
  });

  const PERSONAL_NAME = server.create('contributor-name-type', { name: 'Personal name' });
  server.create('contributor-name-type', { name: 'Corporate name' });
  server.create('contributor-name-type', { name: 'Meeting name' });


  server.create('classification-type', { name: 'Additional Dewey' });
  server.create('classification-type', { name: 'Canadian Classification' });
  server.create('classification-type', { name: 'GDC' });
  server.create('classification-type', { name: 'LC' });
  server.create('classification-type', { name: 'NLM' });
  server.create('classification-type', { name: 'National Agricultural Library' });
  server.create('classification-type', { name: 'UDC' });

  // server.create('mode-of-issuance', )

  server.create('statistical-code-type', { name: 'Resource' });
  server.create('statistical-code-type', { name: 'No information provided' });
  server.create('statistical-code-type', { name: 'Related resource' });
  server.create('statistical-code-type', { name: 'Version of resource' });
  server.create('statistical-code-type', { name: 'No display constant generated' });

  server.create('item-damaged-status', { name: 'Damaged' });
  server.create('item-damaged-status', { name: 'Not damaged' });

  server.create('blocked-field', 'discoverySuppress');
  server.create('blocked-field', 'previouslyHeld');
  server.create('blocked-field', 'statusId');
  server.create('blocked-field', 'hrid');
  server.create('blocked-field', 'staffSuppress');
  server.create('blocked-field', 'source');
  server.create('blocked-field', 'statisticalCode');

  // instances

  server.create('instance', 'withHoldingAndItem', {
    'title': 'ADVANCING LIBRARY EDUCATION: TECHNOLOGICAL INNOVATION AND INSTRUCTIONAL DESIGN',
    'source': 'Local',
    'instanceType': TACTILE_TEXT,
    'identifiers': [
      {
        identifierTypeId: YBP.id,
        value: '9781466636897'
      }
    ],
    'contributors': [
      {
        contributorNameTypeId: PERSONAL_NAME.id,
        name: 'Samuels, Simon'
      }
    ]
  });

  server.create('instance', {
    'title': 'ADVANCING RESEARCH METHODS WITH NEW TECHNOLOGIES.',
    'source': 'Local',
    'instanceType': TACTILE_TEXT,
    'identifiers': [
      {
        'identifierTypeId': YBP.id,
        'value': '9781466639195'
      }
    ],
    'contributors': [
      {
        'contributorNameTypeId': PERSONAL_NAME.id,
        'name': 'Jules, Julian'
      }
    ]
  });
  server.create('instance', {
    title: "10,000 baskets : based on 'Assembly line' a short story by B. Traven ",
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0070285896 (alk. paper)' }],
    contributors: [{ 'primary':true, 'name':'Hewitt, Lonnie Burstein,' }, { 'name':'Bernal, Penny.' }, { 'name':'Traven, B.' }, { 'name':'Hewitt, Lonnie Burstein,' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: "10,000 ideas for term papers, projects, reports, and speeches : intriguing, original research topics for every student's need ",
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0028625129 (pbk.)' }],
    contributors: [{ 'primary':true, 'name':'Lamm, Kathryn.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '10000 sovetov dli͡a tekh, kto zhdet rebenka ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'9856524563 (hbk.) :' }],
    contributors: [{ 'primary':true, 'name':'Koneva, L. S.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1000 best short games of chess : a treasury of masterpieces in miniature ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0671538012 (pbk.) :' }],
    contributors: [{ 'primary':true, 'name':'Chernev, Irving,' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1000 facts about space ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0590486810' }],
    contributors: [{ 'primary':true, 'name':'Beasant, Pam.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1000 facts about the earth ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0590474456' }],
    contributors: [{ 'primary':true, 'name':'Butterfield, Moira,' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1000 giorni al Duemila ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'8821534812' }],
    contributors: [{ 'primary':true, 'name':'John Paul' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1,000 palabras en inglés.',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'2831565537' }],
    contributors: [],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1000 photos of aquarium fish ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0764152173' }],
    contributors: [{ 'primary':true, 'name':'Piednoir, Marie-Paule.' }, { 'name':'Piednoir, Christian.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1,000 Spanish words.',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'2831565529' }],
    contributors: [],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1001 Christmas facts and fancies ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'1558888586 (alk. paper) :' }],
    contributors: [{ 'primary':true, 'name':'Hottes, Alfred Carl,' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1001 do-it-yourself hints & tips : tricks, shortcuts, how-tos, and other nifty ideas for inside, outside, and all around your house.',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0762100494' }],
    contributors: [],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1001 formas de motivar ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'8480882352' }],
    contributors: [{ 'primary':true, 'name':'Nelson, Bob.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1001 ideas para triunfar en su carrera : ideas para conseguir el puesto deseado yo obtener lo mejor del trabajo actual ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'8480883065' }],
    contributors: [{ 'primary':true, 'name':'Tye, Joe.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1,001 low-fat desserts ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'1572840285 (pbk.)' }],
    contributors: [{ 'primary':true, 'name':'Spitler, Sue.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1001 maneras de mejorar los problemas escolares de su hijo ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'8432917575 :' }],
    contributors: [{ 'primary':true, 'name':'Greene, Lawrence J.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1001 provérbios adágios e ditos populares portugueses ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'773491045' }],
    contributors: [{ 'primary':true, 'name':'Ferreira, A.' }, { 'name':'Ferreira, A.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1001 raisons de prendre un amant ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'2911621549' }],
    contributors: [{ 'primary':true, 'name':'Gulliver, Lili.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1001 sex secrets every woman should know ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0380724847' }],
    contributors: [{ 'primary':true, 'name':'Allen, Chris,' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1001 sovet roditeli͡am po vospitanii͡u deteĭ ot A do I͡A Dzheĭn Nelʹsen, Linn Lott, Kh. Stefen Glenn ; perevod s angliĭskogo M.V. Shitarevoĭ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'5232001353' }],
    contributors: [{ 'primary':true, 'name':'Nelsen, Jane.' }, { 'name':'Lott, Lynn.' }, { 'name':'Glenn, H. Stephen.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1001 ways to cut your expenses ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0440504953 :' }],
    contributors: [{ 'primary':true, 'name':'Pond, Jonathan D.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1001 ways to reward employees ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'156305339X' }],
    contributors: [{ 'primary':true, 'name':'Nelson, Bob,' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '1001 ways to save money-- and still havea dazzling wedding ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0809236575' }],
    contributors: [{ 'primary':true, 'name':'Naylor, Sharon.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '100 awesome chess moves ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'1580420214' }],
    contributors: [{ 'primary':true, 'name':'Schiller, Eric.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '100 best careers for writers and artists ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0028619269 (pbk.)' }],
    contributors: [{ 'primary':true, 'name':'Field, Shelly.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '100 books for girls to grow on : lively descriptions of the most inspiring books for girls, terrific discussion questions to spark conversation, great ideas for book-inspired activities, crafts, and field trips ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0060957182' }],
    contributors: [{ 'primary':true, 'name':'Dodson, Shireen.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '100 Colonial leaders : who shaped North America ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0912517352 (pbk.) :' }],
    contributors: [{ 'primary':true, 'name':'Crompton, Samuel Willard.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '100 contemporary architects : drawings & sketches ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'0500341192 :' }],
    contributors: [{ 'name':'Lacy, Bill.' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '100 drugs that work : a guide to the best prescription and non-prescription drugs ',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'1565652142 (pbk.) :' }],
    contributors: [{ 'primary':true, 'name':'Oppenheim, Michael,' }],
    publication: [],
    languages: [],
    notes: []
  });

  server.create('instance', {
    title: '100% Ginuwine',
    source: 'local',
    alternativeTitles: [],
    series: [],
    identifiers: [{ 'value':'4905943936' }],
    contributors: [{ 'primary':true, 'name':'Ginuwine,' }],
    publication: [],
    languages: [],
    notes: []
  });
}
