$(document).on('ready', function () {
    connect_to_server();
	$('#createMarbleButton').click(function () {
		var id  = populate_uid();					
		var obj = {
			type: 'create',
            uid: id,
            sid: "registry",
			state_id: 's01506732319513SMUHf',
			v: 1
		};
		console.log('creating listing, sending', obj);
		$('#createPanel').fadeOut();
		$('#tint').fadeOut();

		show_tx_step({ state: 'building_proposal' }, function () {
			ws.send(JSON.stringify(obj));

			refreshHomePanel();
		});

		return false;
	});

	$('#saveMarbleButton').click(function () {
		var obj = {
			type: 'update_source',
            listing_id: $('input[name=id]').val(),
            source_id:$('input[name=sid]').val()
		};
		console.log('saving listing, sending', obj);
		$('#marketPanel').fadeOut();
		$('#tint').fadeOut();

		show_tx_step({ state: 'building_proposal' }, function () {
			ws.send(JSON.stringify(obj));
			refreshHomePanel();
		});

		return false;
	});



	//close create panel
	$('.fa-close').click(function () {
		$('#createPanel,#marketPanel, #tint, #infoPanel').fadeOut();
	});

	/**  
	 * Audit Listing
	*/		
	$(document).on('click', '.ball', function () {
		var state = $(this).attr('state_type');
		var id=$(this).attr('id');
		var sid=$(this).attr('sid');
		var uid=$(this).attr('uid')
		if(state=="premarket"){
			$('input[name=id]').val(id);
			$('.market').html(uid);		
			$('#tint').fadeIn();
			$('#marketPanel').fadeIn();
		}else{
			auditMarble(id,sid,uid);					
		}				
	});

	$('#auditClose').click(function () {
		$('#auditContentWrap').slideUp(500);
		$('.auditingMarble').removeClass('auditingMarble');												//reset
		for (var x in pendingTxDrawing) clearTimeout(pendingTxDrawing[x]);
		setTimeout(function () {
			$('.txHistoryWrap').html('<div class="auditHint">Click a Marble to Audit Its Transactions</div>');//clear
		}, 750);
		$('#marbleId').html('-');
		auditingMarbleId = null;

		setTimeout(function () {
			$('#rightEverything').removeClass('rightEverythingOpened');
		}, 500);
		$('#leftEverything').fadeOut();
	});

	$('#auditButton').click(function () {
		openAuditPanel('Audit');
	});

	/**
	 * Query
 	*/

	//username/company search
	$('#searchUsers').keyup(function (e) {
		if(e.keyCode==13){
			var qt = $('select[name="query-type"]').val();
			var input = $('#searchUsers').val();
			query_results(qt,'$regex',input)
		}
	});

	//username/company search
	$('#fips').keyup(function (e) {
		query_fips($('#fips').val());
	});
	$('input[name="parcel"').keyup(function (e) {
		populate_uid();
	});
	$('select[name="property-type"').change(function (e) {
		console.log(this);
		if($(this).val()!='S'){
			$('input[name="sub"').val('N');
		}
		populate_uid();
	});
	$('input[name="sub"').keyup(function (e) {
		populate_uid();
	});
	
	//story mode selection
	$('#disableStoryMode').click(function () {
		fromLS.story_mode = false;
		$('#disableStoryMode').prop('disabled', true);
		$('#enableStoryMode').prop('disabled', false);
	});
	$('#enableStoryMode').click(function () {
		fromLS.story_mode = true;
		$('#enableStoryMode').prop('disabled', true);
		$('#disableStoryMode').prop('disabled', false);
	});	
});
