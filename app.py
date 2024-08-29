from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS, cross_origin
from flask.helpers import send_from_directory
from bson import ObjectId
import datetime

app = Flask(__name__, static_folder='office_inventorysystem/build', static_url_path='')

# Link to Database
client = MongoClient('mongodb+srv://CyberXTeam:CybeerXPass@officeinventorysystem.mj2id19.mongodb.net/')

db = client['office_inventory_system']

CORS(app)

@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/signin', methods=['POST'])
@cross_origin()
def signin():
    if request.method == 'POST':
        data = request.json
        staffId = data.get('staffId')
        password = data.get('password')
        
        # Check if user is an admin
        user = db['Users'].find_one({'staffId': staffId, 'password': password})
        
        if user:
            db['Users'].update_one(
                {'_id': user['_id']},
                {'$set': {'last_login': datetime.datetime.now(datetime.UTC)}}
            )
            db['UserLoginTimes'].insert_one({
                'userId': user['_id'],
                'loginTime': datetime.datetime.now(datetime.UTC)
            })
            return jsonify({'success': True, 'message': 'Login successful', 'userId': str(user['_id']), 'dashboard': '/admin/dashboard'})
        
        # Check if user is an employee
        employee = db['Employees'].find_one({'emplID': staffId, 'password': password})
        
        if employee:
            return jsonify({'success': True, 'message': 'Login successful', 'userId': str(employee['_id']), 'dashboard': '/employee/dashboard'})
        
        return jsonify({'success': False, 'message': 'Invalid credentials'})
        
@app.route('/api/user_activity', methods=['GET'])
@cross_origin()
def user_activity():
    pipeline = [
        {"$group": {"_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$loginTime"}}, "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    activity = list(db['UserLoginTimes'].aggregate(pipeline))
    dates = [item['_id'] for item in activity]
    counts = [item['count'] for item in activity]
    
    return jsonify({"dates": dates, "activity": counts})

@app.route('/user/<id>', methods=['GET'])
@cross_origin()
def get_user(id):
    user = db['Users'].find_one({'_id': ObjectId(id)})
    if user:
        return jsonify({'name': user['name'], 'staffId': user['staffId'], 'position': user['position'], 'email': user['email'], 'password': user['password']})
    else:
        return jsonify({'error': 'User not found'})
    
@app.route('/employee/<id>', methods=['GET'])
@cross_origin()
def get_employee(id):
    employee = db['Employees'].find_one({'_id': ObjectId(id)})
    if employee:
        return jsonify({
            'emplName': employee['emplName'],
            'email': employee['email'],
            'emplID': employee['emplID'],
            'contact': employee['contact']
        })
    else:
        return jsonify({'error': 'Employee not found'})

    
@app.route('/update_password', methods=['POST'])
@cross_origin()
def update_password():
    if request.method == 'POST':
        data = request.json
        staffId = data.get('staffId')
        oldPass = data.get('oldPass')
        newPass = data.get('newPass')
        confirmPass = data.get('confirmPass')

        user = db['Users'].find_one({'staffId': staffId})

        currentPass = user.get('password')

        if user:
            if currentPass == oldPass:
                if confirmPass == newPass:
                    db['Users'].update_one({'staffId': staffId}, {'$set': {'password': newPass}})
                    return jsonify({'success': True, 'message': 'Password updated successfully'})
                else:
                    return jsonify({'success': False, 'message': 'New Passwords do not match!'})
            else:
                    return jsonify({'success': False, 'message': 'Current password is incorrect!'})
        else:
            return jsonify({'success': False, 'message': 'Password update unsuccessful'})

@app.route('/add_user', methods=['POST'])
@cross_origin()
def add_user():
    if request.method == 'POST':
        data = request.json
        employeeName = data.get('employeeName')
        employeeID = data.get('employeeID')
        email = data.get('email')
        phoneNumber = data.get('phoneNumber')
        
        employee = db['Employees'].find_one({'emplName': employeeName, 'emplID': employeeID, 'email': email, 'contact': phoneNumber})
        
        if employee:
            return jsonify({'success': False, 'message': 'User already exists'})
        else:
            db['Employees'].insert_one({'emplName': employeeName, 'emplID': employeeID, 'email': email, 'contact': phoneNumber})
            return jsonify({'success': True, 'message': 'User added successfully'})
        

@app.route('/update_user', methods=['POST'])
@cross_origin()
def update_user():
    if request.method == 'POST':
        data = request.json
        employeeName = data.get('employeeName')
        employeeID = data.get('employeeID')
        email = data.get('email')
        phoneNumber = data.get('phoneNumber')
        
        employee = db['Employees'].find_one({'emplID': employeeID})
        
        if employee:
            db['Employees'].update_one({'emplID': employeeID}, {'$set': {'emplName': employeeName, 'email': email, 'contact': phoneNumber}})
            return jsonify({'success': True, 'message': 'User updated successfully'})
        else:
            return jsonify({'success': False, 'message': 'User does not exist'})
        
@app.route('/remove_user', methods=['POST'])
@cross_origin()
def remove_user():
    if request.method == 'POST':
        data = request.json
        employeeName = data.get('employeeName')
        employeeID = data.get('employeeID')
        
        employee = db['Employees'].find_one({'emplID': employeeID, 'emplName': employeeName})

        if employee:
            db['Employees'].delete_one({'emplName': employeeName, 'emplID': employeeID})
            return jsonify({'success': True, 'message': 'User removed successfully'})
        else:
            return jsonify({'success': False, 'message': 'User does not exist'})


@app.route('/employees', methods=['GET'])
@cross_origin()
def get_employees():
    employees = list(db['Employees'].find())
    for employee in employees:
        employee['_id'] = str(employee['_id'])
    return jsonify(employees)

@app.route('/inventory', methods=['GET'])
@cross_origin()
def get_inventory():
    inventory = list(db['Inventory'].find())
    for item in inventory:
        item['_id'] = str(item['_id'])
    return jsonify(inventory)


@app.route('/reports', methods=['GET'])
@cross_origin()
def get_report():
    reports = list(db['Reports'].find())
    for report in reports:
        report['_id'] = str(report['_id'])
    return jsonify(reports)


@app.route('/add_inventory', methods=['POST'])
@cross_origin()
def add_inventory():
    if request.method == 'POST':
        data = request.json
        equipmentID = data.get('equipmentID')
        equipmentName = data.get('equipmentName')
        type = data.get('type')
        condition = data.get('condition')
        location = data.get('location')
        assignment = data.get('assignment')
        purchasedate = data.get('purchasedate')

    inventory = db['Inventory'].find_one({'equipment_id': equipmentID, 'name': equipmentName, 'type': type, 'condition': condition, 'location': location, 'assigned_to': assignment, 'purchase_date': purchasedate})

    if inventory:
        return jsonify({'success': False, 'message': 'Item already exists'})
    else:
        db['Inventory'].insert_one({'equipment_id': equipmentID, 'name': equipmentName, 'type': type, 'condition': condition, 'location': location, 'assigned_to': assignment, 'purchase_date': purchasedate})
        return jsonify({'success': True, 'message': 'Item added successfully'})


@app.route('/update_inventory', methods=['POST'])
@cross_origin()
def update_inventory():
    if request.method == 'POST':
        data = request.json
        equipmentID = data.get('equipmentID')
        condition = data.get('condition')
        location = data.get('location')
        assignment = data.get('assignment')

    inventory = db['Inventory'].find_one({'equipment_id': equipmentID})

    if inventory:
        db['Inventory'].update_one({'equipment_id': equipmentID}, {'$set': {'condition': condition, 'location': location, 'assigned_to': assignment}})
        return jsonify({'success': True, 'message': 'Item updated successfully'})
    else:
        return jsonify({'success': False, 'message': 'Item doesnot exist'})
    
@app.route('/remove_inventory', methods=['POST'])
@cross_origin()
def remove_inventory():
    if request.method == 'POST':
        data = request.json
        equipmentID = data.get('equipmentID')
        equipmentName = data.get('equipmentName')

    inventory = db['Inventory'].find_one({'equipment_id': equipmentID, 'name': equipmentName})

    if inventory:
        db['Inventory'].delete_one({'equipment_id': equipmentID, 'name': equipmentName})
        return jsonify({'success': True, 'message': 'Item removed successfully'})
    else:
        return jsonify({'success': False, 'message': 'Item does not exist'})
    
@app.route('/add_report', methods=['POST'])
@cross_origin()
def add_report():
    if request.method == 'POST':
        data = request.json
        assignmentID = data.get('assignmentID')
        employeeID = data.get('employeeID')
        equipmentID = data.get('equipmentID')
        assignmentDate = data.get('assignmentDate')
        date = data.get('date')

    report = db['Reports'].find_one({'assignment_id': assignmentID})
    
    if report:
        return jsonify({'success': False, 'message': 'Report already exists'})
    else:
        db['Reports'].insert_one({'assignment_id': assignmentID, 'employee_id': employeeID, 'equipment_id': equipmentID, 'assignment_date': assignmentDate, 'return_date': date})
        return jsonify({'success': True, 'message': 'Report added successfully'})
    
@app.route('/update_report', methods=['POST'])
@cross_origin()
def update_report():
    if request.method == 'POST':
        data = request.json
        assignmentID = data.get('assignmentID')
        employeeID = data.get('employeeID')
        equipmentID = data.get('equipmentID')
        assignmentDate = data.get('assignmentDate')
        return_date = data.get('returnDate')

    report = db['Reports'].find_one({'assignment_id': assignmentID})

    if report:
        db['Reports'].update_one({'assignment_id': assignmentID}, {'$set': {'employee_id': employeeID, 'equipment_id': equipmentID, 'assignment_date': assignmentDate, 'return_date': return_date}})
        return jsonify({'success': True, 'message': 'Report updated successfully'})
    else:
        return jsonify({'success': False, 'message': 'Report does not exist'})
    

@app.route('/api/inventory_summary', methods=['GET'])
@cross_origin()
def inventory_summary():
    pipeline = [
        {"$group": {"_id": "$type", "count": {"$sum": 1}}}
    ]
    summary = list(db['Inventory'].aggregate(pipeline))
    result = {item['_id']: item['count'] for item in summary}
    return jsonify(result)




if __name__ == "__main__":
    app.debug = True
    app.run()