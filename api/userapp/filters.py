from django.db.models import Q

def apply_filters(queryset, params):
    """Apply search, year, and price filters to the queryset."""

    # Search filter
    search_query = params.get('search', '')
    if search_query:
        queryset = queryset.filter(
            Q(first_name__icontains=search_query) |
            Q(email__icontains=search_query)
        )

    

    return queryset

