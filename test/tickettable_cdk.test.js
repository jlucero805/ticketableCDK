"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.BASE_ENDPOINT;
test('GET /members', async () => {
    const res = await axios_1.default.get(url + '/members', {
        headers: {
            authorization: '123',
        },
    });
    expect(res.status).toBe(200);
});
test('POST /members', async () => {
    let status;
    try {
        const res = await axios_1.default.post(url + '/members', {
            username: 'jluce',
            email: 'jluce@test.com',
            name: 'Jason',
        }, {
            headers: {
                authorization: '123',
            },
        });
        status = res.status;
    }
    catch (e) {
        status = e.response.status;
    }
    ;
    expect(status).toBe(409);
});
test('GET /members/{memberId}', async () => {
    const res = await axios_1.default.get(url + '/members/f697d05a-8e17-4d6c-ad66-57efd53aa524', {
        headers: {
            authorization: '123',
        },
    });
    expect(res.status).toBe(200);
});
test('PUT /members/{memberId}', async () => {
    const res = await axios_1.default.put(url + '/members/f697d05a-8e17-4d6c-ad66-57efd53aa524', {
        description: 'nice',
        name: 'name',
    }, {
        headers: {
            authorization: '123',
        },
    });
    expect(res.status).toBe(200);
    expect(res.data.rows[0].description)
        .toBe('nice');
    expect(res.data.rows[0].name)
        .toBe('name');
});
test('GET /members/{memberId}/projects', async () => {
    const res = await axios_1.default.get(url + '/members/f697d05a-8e17-4d6c-ad66-57efd53aa524/projects', {
        headers: {
            authorization: '123',
        },
    });
    expect(res.status).toBe(200);
});
test('POST /members/{memberId}/projects', async () => {
    let status;
    try {
        const res = await axios_1.default.post(url + '/members/f697d05a-8e17-4d6c-ad66-57efd53aa524/projects', {
            name: 'ticketable',
        }, {
            headers: {
                authorization: '123',
            },
        });
        status = res.status;
    }
    catch (e) {
        status = e.response.status;
    }
    ;
    expect(status).toBe(409);
});
test('GET /orgs', async () => {
    const res = await axios_1.default.get(url + '/orgs', {
        headers: {
            authorization: '123',
        },
    });
    expect(res.status).toBe(200);
});
test('POST /orgs', async () => {
    let status;
    try {
        const res = await axios_1.default.post(url + '/orgs', {
            username: 'Amazon',
            email: 'amazon@test.com',
            name: 'Amazon',
        }, {
            headers: {
                authorization: '123',
            },
        });
        status = res.status;
    }
    catch (e) {
        status = e.response.status;
    }
    ;
    expect(status).toBe(409);
});
test('GET /orgs/{orgId}', async () => {
    const res = await axios_1.default.get(url + '/orgs/4ada500d-eb71-4105-9b6c-4b97010d17c6', {
        headers: {
            authorization: '123',
        },
    });
    expect(res.status).toBe(200);
});
test('PUT /orgs/{orgId}', async () => {
    let status;
    let res;
    try {
        res = await axios_1.default.put(url + '/orgs/4ada500d-eb71-4105-9b6c-4b97010d17c6', {
            name: 'Amazon',
            description: 'new description'
        }, {
            headers: {
                authorization: '123',
            },
        });
        status = res.status;
    }
    catch (e) {
        status = e.response.status;
    }
    ;
    expect(status).toBe(200);
    expect(res === null || res === void 0 ? void 0 : res.data.rows[0].description)
        .toBe('new description');
});
test('GET /projects/{projectId}/tickets', async () => {
    const res = await axios_1.default
        .get(url + '/projects/f00f5603-d518-46e4-a8e5-1326b3bf19df/tickets', {
        headers: {
            authorization: '123',
        },
    });
    expect(res.status).toBe(200);
});
test('POST /projects/{projectId}/tickets', async () => {
    let status;
    let res;
    try {
        res = await axios_1.default.post(url + '/projects/f00f5603-d518-46e4-a8e5-1326b3bf19df/tickets', {
            title: 'new title',
            priority: 'low',
            description: 'new description'
        }, {
            headers: {
                authorization: '123',
            },
        });
        status = res.status;
    }
    catch (e) {
        status = e.response.status;
    }
    ;
    expect(status).toBe(201);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlja2V0dGFibGVfY2RrLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0aWNrZXR0YWJsZV9jZGsudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLGlDQUEwQjtBQUMxQixpQ0FBaUM7QUFDakMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO0FBRXRDLElBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDOUIsTUFBTSxHQUFHLEdBQUcsTUFBTSxlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxVQUFVLEVBQUU7UUFDNUMsT0FBTyxFQUFFO1lBQ1AsYUFBYSxFQUFFLEtBQUs7U0FDckI7S0FDRixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDL0IsSUFBSSxNQUFNLENBQUM7SUFDWCxJQUFJO1FBQ0YsTUFBTSxHQUFHLEdBQUcsTUFBTSxlQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLEVBQUU7WUFDN0MsUUFBUSxFQUFFLE9BQU87WUFDakIsS0FBSyxFQUFFLGdCQUFnQjtZQUN2QixJQUFJLEVBQUUsT0FBTztTQUNkLEVBQ0Q7WUFDRSxPQUFPLEVBQUU7Z0JBQ1AsYUFBYSxFQUFFLEtBQUs7YUFDckI7U0FDRixDQUNBLENBQUM7UUFDRixNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztLQUNyQjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsTUFBTSxHQUFJLENBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0tBQ3JDO0lBQUEsQ0FBQztJQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FB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RyxDQUFDLE1BQU0sQ0FBQztLQUNyQjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsTUFBTSxHQUFJLENBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0tBQ3JDO0lBQUEsQ0FBQztJQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleHBlY3QgYXMgZXhwZWN0Q0RLLCBtYXRjaFRlbXBsYXRlLCBNYXRjaFN0eWxlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0JztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIFRpY2tldHRhYmxlQ2RrIGZyb20gJy4uL2xpYi90aWNrZXR0YWJsZV9jZGstc3RhY2snO1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCAqIGFzIGRvdGVudiBmcm9tICdkb3RlbnYnO1xuZG90ZW52LmNvbmZpZygpO1xuXG5jb25zdCB1cmwgPSBwcm9jZXNzLmVudi5CQVNFX0VORFBPSU5UO1xuXG50ZXN0KCdHRVQgL21lbWJlcnMnLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGF4aW9zLmdldCh1cmwgKyAnL21lbWJlcnMnLCB7XG4gICAgaGVhZGVyczoge1xuICAgICAgYXV0aG9yaXphdGlvbjogJzEyMycsXG4gICAgfSxcbiAgfSk7XG4gIGV4cGVjdChyZXMuc3RhdHVzKS50b0JlKDIwMCk7XG59KTtcblxudGVzdCgnUE9TVCAvbWVtYmVycycsIGFzeW5jICgpID0+IHtcbiAgbGV0IHN0YXR1cztcbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBheGlvcy5wb3N0KHVybCArICcvbWVtYmVycycsIHtcbiAgICAgIHVzZXJuYW1lOiAnamx1Y2UnLFxuICAgICAgZW1haWw6ICdqbHVjZUB0ZXN0LmNvbScsXG4gICAgICBuYW1lOiAnSmFzb24nLFxuICAgIH0sXG4gICAgeyBcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgYXV0aG9yaXphdGlvbjogJzEyMycsXG4gICAgICB9LFxuICAgIH1cbiAgICApO1xuICAgIHN0YXR1cyA9IHJlcy5zdGF0dXM7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzdGF0dXMgPSAoZSBhcyBhbnkpLnJlc3BvbnNlLnN0YXR1cztcbiAgfTtcbiAgZXhwZWN0KHN0YXR1cykudG9CZSg0MDkpO1xufSk7XG5cbnRlc3QoJ0dFVCAvbWVtYmVycy97bWVtYmVySWR9JywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCByZXMgPSBhd2FpdCBheGlvcy5nZXQodXJsICsgJy9tZW1iZXJzL2Y2OTdkMDVhLThlMTctNGQ2Yy1hZDY2LTU3ZWZkNTNhYTUyNCcsIHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICBhdXRob3JpemF0aW9uOiAnMTIzJyxcbiAgICB9LFxuICB9KTtcbiAgZXhwZWN0KHJlcy5zdGF0dXMpLnRvQmUoMjAwKTtcbn0pO1xuXG50ZXN0KCdQVVQgL21lbWJlcnMve21lbWJlcklkfScsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgYXhpb3MucHV0KHVybCArICcvbWVtYmVycy9mNjk3ZDA1YS04ZTE3LTRkNmMtYWQ2Ni01N2VmZDUzYWE1MjQnLFxuICB7XG4gICAgZGVzY3JpcHRpb246ICduaWNlJyxcbiAgICBuYW1lOiAnbmFtZScsXG4gIH0sXG4gIHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICBhdXRob3JpemF0aW9uOiAnMTIzJyxcbiAgICB9LFxuICB9KTtcbiAgZXhwZWN0KHJlcy5zdGF0dXMpLnRvQmUoMjAwKTtcbiAgZXhwZWN0KHJlcy5kYXRhLnJvd3NbMF0uZGVzY3JpcHRpb24pXG4gICAgLnRvQmUoJ25pY2UnKTtcbiAgZXhwZWN0KHJlcy5kYXRhLnJvd3NbMF0ubmFtZSlcbiAgICAudG9CZSgnbmFtZScpO1xufSk7XG5cbnRlc3QoJ0dFVCAvbWVtYmVycy97bWVtYmVySWR9L3Byb2plY3RzJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCByZXMgPSBhd2FpdCBheGlvcy5nZXQodXJsICsgJy9tZW1iZXJzL2Y2OTdkMDVhLThlMTctNGQ2Yy1hZDY2LTU3ZWZkNTNhYTUyNC9wcm9qZWN0cycsIHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICBhdXRob3JpemF0aW9uOiAnMTIzJyxcbiAgICB9LFxuICB9KTtcbiAgZXhwZWN0KHJlcy5zdGF0dXMpLnRvQmUoMjAwKTtcbn0pO1xuXG50ZXN0KCdQT1NUIC9tZW1iZXJzL3ttZW1iZXJJZH0vcHJvamVjdHMnLCBhc3luYyAoKSA9PiB7XG4gIGxldCBzdGF0dXM7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXhpb3MucG9zdCh1cmwgKyAnL21lbWJlcnMvZjY5N2QwNWEtOGUxNy00ZDZjLWFkNjYtNTdlZmQ1M2FhNTI0L3Byb2plY3RzJywge1xuICAgICAgbmFtZTogJ3RpY2tldGFibGUnLFxuICAgIH0sXG4gICAgeyBcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgYXV0aG9yaXphdGlvbjogJzEyMycsXG4gICAgICB9LFxuICAgIH1cbiAgICApO1xuICAgIHN0YXR1cyA9IHJlcy5zdGF0dXM7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzdGF0dXMgPSAoZSBhcyBhbnkpLnJlc3BvbnNlLnN0YXR1cztcbiAgfTtcbiAgZXhwZWN0KHN0YXR1cykudG9CZSg0MDkpO1xufSk7XG5cbnRlc3QoJ0dFVCAvb3JncycsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgYXhpb3MuZ2V0KHVybCArICcvb3JncycsIHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICBhdXRob3JpemF0aW9uOiAnMTIzJyxcbiAgICB9LFxuICB9KTtcbiAgZXhwZWN0KHJlcy5zdGF0dXMpLnRvQmUoMjAwKTtcbn0pO1xuXG50ZXN0KCdQT1NUIC9vcmdzJywgYXN5bmMgKCkgPT4ge1xuICBsZXQgc3RhdHVzO1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGF4aW9zLnBvc3QodXJsICsgJy9vcmdzJywge1xuICAgICAgdXNlcm5hbWU6ICdBbWF6b24nLFxuICAgICAgZW1haWw6ICdhbWF6b25AdGVzdC5jb20nLFxuICAgICAgbmFtZTogJ0FtYXpvbicsXG4gICAgfSxcbiAgICB7IFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBhdXRob3JpemF0aW9uOiAnMTIzJyxcbiAgICAgIH0sXG4gICAgfVxuICAgICk7XG4gICAgc3RhdHVzID0gcmVzLnN0YXR1cztcbiAgfSBjYXRjaCAoZSkge1xuICAgIHN0YXR1cyA9IChlIGFzIGFueSkucmVzcG9uc2Uuc3RhdHVzO1xuICB9O1xuICBleHBlY3Qoc3RhdHVzKS50b0JlKDQwOSk7XG59KTtcblxudGVzdCgnR0VUIC9vcmdzL3tvcmdJZH0nLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGF4aW9zLmdldCh1cmwgKyAnL29yZ3MvNGFkYTUwMGQtZWI3MS00MTA1LTliNmMtNGI5NzAxMGQxN2M2Jywge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgIGF1dGhvcml6YXRpb246ICcxMjMnLFxuICAgIH0sXG4gIH0pO1xuICBleHBlY3QocmVzLnN0YXR1cykudG9CZSgyMDApO1xufSk7XG5cbnRlc3QoJ1BVVCAvb3Jncy97b3JnSWR9JywgYXN5bmMgKCkgPT4ge1xuICBsZXQgc3RhdHVzO1xuICBsZXQgcmVzO1xuICB0cnkge1xuICAgIHJlcyA9IGF3YWl0IGF4aW9zLnB1dCh1cmwgKyAnL29yZ3MvNGFkYTUwMGQtZWI3MS00MTA1LTliNmMtNGI5NzAxMGQxN2M2Jywge1xuICAgICAgbmFtZTogJ0FtYXpvbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ25ldyBkZXNjcmlwdGlvbidcbiAgICB9LFxuICAgIHsgXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIGF1dGhvcml6YXRpb246ICcxMjMnLFxuICAgICAgfSxcbiAgICB9XG4gICAgKTtcbiAgICBzdGF0dXMgPSByZXMuc3RhdHVzO1xuICB9IGNhdGNoIChlKSB7XG4gICAgc3RhdHVzID0gKGUgYXMgYW55KS5yZXNwb25zZS5zdGF0dXM7XG4gIH07XG4gIGV4cGVjdChzdGF0dXMpLnRvQmUoMjAwKTtcbiAgZXhwZWN0KHJlcz8uZGF0YS5yb3dzWzBdLmRlc2NyaXB0aW9uKVxuICAgIC50b0JlKCduZXcgZGVzY3JpcHRpb24nKTtcbn0pO1xuXG50ZXN0KCdHRVQgL3Byb2plY3RzL3twcm9qZWN0SWR9L3RpY2tldHMnLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGF4aW9zXG4gICAgLmdldCh1cmwgKyAnL3Byb2plY3RzL2YwMGY1NjAzLWQ1MTgtNDZlNC1hOGU1LTEzMjZiM2JmMTlkZi90aWNrZXRzJywge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICBhdXRob3JpemF0aW9uOiAnMTIzJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZXhwZWN0KHJlcy5zdGF0dXMpLnRvQmUoMjAwKTtcbn0pO1xuXG50ZXN0KCdQT1NUIC9wcm9qZWN0cy97cHJvamVjdElkfS90aWNrZXRzJywgYXN5bmMgKCkgPT4ge1xuICBsZXQgc3RhdHVzO1xuICBsZXQgcmVzO1xuICB0cnkge1xuICAgIHJlcyA9IGF3YWl0IGF4aW9zLnBvc3QodXJsICsgJy9wcm9qZWN0cy9mMDBmNTYwMy1kNTE4LTQ2ZTQtYThlNS0xMzI2YjNiZjE5ZGYvdGlja2V0cycsIHtcbiAgICAgIHRpdGxlOiAnbmV3IHRpdGxlJyxcbiAgICAgIHByaW9yaXR5OiAnbG93JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnbmV3IGRlc2NyaXB0aW9uJ1xuICAgIH0sXG4gICAgeyBcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgYXV0aG9yaXphdGlvbjogJzEyMycsXG4gICAgICB9LFxuICAgIH1cbiAgICApO1xuICAgIHN0YXR1cyA9IHJlcy5zdGF0dXM7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzdGF0dXMgPSAoZSBhcyBhbnkpLnJlc3BvbnNlLnN0YXR1cztcbiAgfTtcbiAgZXhwZWN0KHN0YXR1cykudG9CZSgyMDEpO1xufSk7Il19